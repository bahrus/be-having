import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, PPE, VirtualProps, Proxy, ProxyProps, PPP, ImportConfig} from './types';
import {BeHaving as BeHavingType, QueryInfo, CSSSelectorBeHavingMap} from 'trans-render/lib/types';

export class BeHaving extends EventTarget implements Actions{


    makeSelfBeExportable(pp: ProxyProps){
        const {self} = pp;
        if((self as any)._modExport){
            return [{}, {
                importMake: true,
            }] as PPE;
        }
        self.setAttribute('be-exportable', '');
        import('be-exportable/be-exportable.js');
        return [{}, {
            importMake: {on: 'load', of: self, },
        }] as PPE;
    }

    async importMake(pp: PP): Promise<PPP | PPE> {
        const {make, self} = pp;
        const exports = (self as any)._modExport;
        const mergedMake = make || {};
        const externalMakePromiseOrPromises = exports.make as string | string[];
        if(externalMakePromiseOrPromises !== undefined){
            const externalMakePromises = Array.isArray(externalMakePromiseOrPromises) ? externalMakePromiseOrPromises : [externalMakePromiseOrPromises];
            const failures: any[] = [];
            let didImport = false;
            for(const externalMakePromise of externalMakePromises){
                try{
                    const externalMake = await import(externalMakePromise);
                    Object.assign(mergedMake, externalMake.make);
                    didImport = true;
                    break;
                }catch(e){
                    console.debug(e);
                    failures.push(e);
                }
            }
            if(!didImport){
                throw {msg: 'Failure to import', externalMakePromiseOrPromises, failures}
            }
        }

        return {
            make: mergedMake,
            readyToObserve: true,
        }
    }

    async doImports(pp: PP){
        const {make, self} = pp;
        const exports = (self as any)._modExport;
        for(const key in make){
            const ruleOrRules = make[key]
            const rules = Array.isArray(ruleOrRules) ? ruleOrRules : [ruleOrRules];
            for(const rule of rules){
                const {be, having} = rule;
                const impConfig = exports[be] as ImportConfig;
                const {impl} = impConfig;
                const impls = Array.isArray(impl) ? impl : [impl];
                let didImport = false;
                const failures: any[] = [];
                for(const imp of impls){
                    try{
                        await import(imp);
                        didImport = true;
                        break;
                    }catch(e){
                        console.debug(e);
                        failures.push(e);
                    }
                }
                if(!didImport){
                    throw {msg: 'Failure to import', impls, failures}
                }
                if(typeof having === 'string'){
                    const complexHaving = exports[having];
                    if(complexHaving !== undefined){
                        rule.having = complexHaving;
                    }
                }
            }
        }
    }

    setReadyToObserve(pp: PP): PPP {
        return {readyToObserve: true};
    }

    #observer: MutationObserver | undefined;
    #queries: Map<string, QueryInfo> = new Map();
    async makeBe(pp: PP){
        const {make, self, scope} = pp;
        const {findRealm} = await import('trans-render/lib/findRealm.js');
        const fragment = await findRealm(self, scope!) as DocumentFragment;
        if(fragment === null) throw '404: BH.makeBE';
        //const rootNode = self.getRootNode() as DocumentFragment;
        const keys = Object.keys(make!);
        if(keys.length > 1 || keys[0] !== ':host'){
            this.#observer = new MutationObserver(mutations => {
                mutations.forEach(({addedNodes}) => {
                    addedNodes.forEach(async node => {
                        if(!(node instanceof Element)) return;
                        for(const key in make){
                            if(key === ':host') continue;
                            const rule = make[key];
                            let cssSelector = key;
                            if(hasCapitalLetterRegExp.test(key)){
                                if(!this.#queries.has(key)){
                                    const {getQuery} = await import('trans-render/lib/specialKeys.js');
                                    this.#queries.set(key, getQuery(key));
                                }
                                const qry = this.#queries.get(key)!;
                                cssSelector = qry.query;
                                
                            }
                            if(node.matches(cssSelector)){
                                await this.#processEl(node, key, make);
                            }
                        }
                    })
                });
            });
            this.#observer.observe(fragment as Node, {
                childList: true,
                subtree: true,
            });
        }
        for(const key in make){
            
            if(key === ':host'){
                await this.#processEl((fragment as any).host, key, make);
            }else{
                const rule = make[key];
                let cssSelector = key;
                if(hasCapitalLetterRegExp.test(key)){
                    if(!this.#queries.has(key)){
                        const {getQuery} = await import('trans-render/lib/specialKeys.js');
                        this.#queries.set(key, getQuery(key));
                    }
                    const qry = this.#queries.get(key)!;
                    cssSelector = qry.query;
                }
                fragment.querySelectorAll(cssSelector).forEach(async node => {
                    await this.#processEl(node, key, make);
                });
            }

        }
    }
    async #processEl(matchingEl: Element, key: string,  make: CSSSelectorBeHavingMap){
        const {makeItBe} = await import('trans-render/lib/makeBe.js');
        makeItBe(matchingEl, key, make);
    }
}

const hasCapitalLetterRegExp = /[A-Z]/;

const tagName = 'be-having';

const ifWantsToBe = 'having';

const upgrade = 'script';

define<PPP & BeDecoratedProps<PPP, Actions>, Actions>({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            forceVisible: ['script'],
            virtualProps: ['make', 'loadScript', 'scope'],
            proxyPropDefaults:{
                loadScript: true,
                scope: 'rn'
            }
        },
        actions: {
            makeBe: {
                ifAllOf: ['make', 'readyToObserve'],
            },
            makeSelfBeExportable: 'loadScript',
            doImports: {
                ifAllOf: ['readyToObserve', 'loadScript', 'make']
            },
            setReadyToObserve: {
                ifAllOf: ['make'],
                ifNoneOf: ['loadScript']
            }
        },
    },
    complexPropDefaults: {
        controller: BeHaving,
    }
});

register(ifWantsToBe, upgrade, tagName);

import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, PPE, VirtualProps, Proxy, ProxyProps, PPP} from './types';
import {BeHaving as BeHavingType, QueryInfo, CSSSelectorBeHavingMap} from 'trans-render/lib/types';

export class BeHaving extends EventTarget implements Actions{


    importSymbols(pp: ProxyProps){
        const {self} = pp;
        if((self as any)._modExport){
            return {
                readyToObserve: true,
            } as PPP;
        }
        return [{}, {
            setReadyToObserve: {on: 'load', of: self}
        }] as PPE;
    }

    setReadyToObserve(pp: PP): PPP {
        return {readyToObserve: true};
    }

    #observer: MutationObserver | undefined;
    #queries: Map<string, QueryInfo> = new Map();
    async makeBe(pp: PP){
        const {make, self} = pp;
        const rootNode = self.getRootNode() as DocumentFragment;
        this.#observer = new MutationObserver(mutations => {
            mutations.forEach(({addedNodes}) => {
                addedNodes.forEach(async node => {
                    if(!(node instanceof Element)) return;
                    for(const key in make){
                        const rule = make[key];
                        //TODO - memoize
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
        this.#observer.observe(rootNode, {
            childList: true,
            subtree: true,
        });
        for(const key in make){
            let cssSelector = key;
            const rule = make[key];

            if(hasCapitalLetterRegExp.test(key)){
                if(!this.#queries.has(key)){
                    const {getQuery} = await import('trans-render/lib/specialKeys.js');
                    this.#queries.set(key, getQuery(key));
                }
                const qry = this.#queries.get(key)!;
                cssSelector = qry.query;
            }
            rootNode.querySelectorAll(cssSelector).forEach(async node => {
                await this.#processEl(node, key, make);
            })
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
            virtualProps: ['make', 'loadScript'],
            proxyPropDefaults:{
                loadScript: true,
            }
        },
        actions: {
            makeBe: {
                ifAllOf: ['make', 'readyToObserve'],
            },
            importSymbols: 'loadScript',
            setReadyToObserve: {
                ifNoneOf: ['loadScript']
            }
        },
    },
    complexPropDefaults: {
        controller: BeHaving,
    }
});

register(ifWantsToBe, upgrade, tagName);

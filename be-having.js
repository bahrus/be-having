import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeHaving extends EventTarget {
    makeSelfBeExportable(pp) {
        const { self } = pp;
        if (self.beDecorated?.exportable?.resolved) {
            return [{}, {
                    importMake: true,
                }];
        }
        if (self._modExport === undefined) {
            self.setAttribute('be-exportable', '');
            import('be-exportable/be-exportable.js');
        }
        return [{}, {
                importMake: { on: 'load', of: self, },
            }];
    }
    async importMake(pp) {
        const { make, self } = pp;
        const exports = self._modExport;
        const mergedMake = make || {};
        //waiting for good use case for this code (probably involving details elements)
        // mergedMake['[be-having]'] = {
        //     be: 'having',
        //     having: {}
        // };
        const externalMakePromiseOrPromises = exports.make;
        if (externalMakePromiseOrPromises !== undefined) {
            const externalMakePromises = Array.isArray(externalMakePromiseOrPromises) ? externalMakePromiseOrPromises : [externalMakePromiseOrPromises];
            const failures = [];
            let didImport = false;
            for (const externalMakePromise of externalMakePromises) {
                try {
                    const externalMake = await import(externalMakePromise);
                    Object.assign(mergedMake, externalMake.make);
                    didImport = true;
                    break;
                }
                catch (e) {
                    console.debug(e);
                    failures.push(e);
                }
            }
            if (!didImport) {
                throw { msg: 'Failure to import', externalMakePromiseOrPromises, failures };
            }
        }
        return {
            make: mergedMake,
            readyToObserve: true,
        };
    }
    async doImports(pp) {
        const { make, self } = pp;
        const exports = self._modExport;
        const { lispToCamel } = await import('trans-render/lib/lispToCamel.js');
        for (const key in make) {
            const ruleOrRules = make[key];
            const rules = Array.isArray(ruleOrRules) ? ruleOrRules : [ruleOrRules];
            for (const rule of rules) {
                const { be, having } = rule;
                const camelBe = lispToCamel(be);
                const impConfig = exports[camelBe];
                if (impConfig === undefined) {
                    if (customElements.get('be-' + be) === undefined) {
                        console.debug("No import for " + camelBe + " specified.");
                    }
                }
                else {
                    const { impl } = impConfig;
                    const impls = Array.isArray(impl) ? impl : [impl];
                    let didImport = false;
                    const failures = [];
                    for (const imp of impls) {
                        try {
                            await import(imp);
                            didImport = true;
                            break;
                        }
                        catch (e) {
                            console.debug(e);
                            failures.push(e);
                        }
                    }
                    if (!didImport) {
                        throw { msg: 'Failure to import', impls, failures };
                    }
                }
                if (typeof having === 'string') {
                    const complexHaving = exports[having];
                    if (complexHaving !== undefined) {
                        rule.having = complexHaving;
                    }
                }
            }
        }
    }
    setReadyToObserve(pp) {
        return { readyToObserve: true };
    }
    #observer;
    #queries = new Map();
    async makeBe(pp) {
        const { make, self, scope } = pp;
        const { findRealm } = await import('trans-render/lib/findRealm.js');
        const fragment = await findRealm(self, scope);
        if (fragment === null)
            throw '404: BH.makeBE';
        //const rootNode = self.getRootNode() as DocumentFragment;
        const keys = Object.keys(make);
        if (keys.length > 1 || keys[0] !== ':host') {
            this.#observer = new MutationObserver(mutations => {
                mutations.forEach(({ addedNodes }) => {
                    addedNodes.forEach(async (node) => {
                        if (!(node instanceof Element))
                            return;
                        for (const key in make) {
                            if (key === ':host')
                                continue;
                            const rule = make[key];
                            let cssSelector = key;
                            if (hasCapitalLetterRegExp.test(key)) {
                                if (!this.#queries.has(key)) {
                                    const { getQuery } = await import('trans-render/lib/specialKeys.js');
                                    this.#queries.set(key, getQuery(key));
                                }
                                const qry = this.#queries.get(key);
                                cssSelector = qry.query;
                            }
                            if (node.matches(cssSelector)) {
                                await this.#processEl(node, key, make);
                            }
                        }
                    });
                });
            });
            this.#observer.observe(fragment, {
                childList: true,
                subtree: true,
            });
        }
        for (const key in make) {
            if (key === ':host') {
                await this.#processEl(fragment.host, key, make);
            }
            else {
                const rule = make[key];
                let cssSelector = key;
                if (hasCapitalLetterRegExp.test(key)) {
                    if (!this.#queries.has(key)) {
                        const { getQuery } = await import('trans-render/lib/specialKeys.js');
                        this.#queries.set(key, getQuery(key));
                    }
                    const qry = this.#queries.get(key);
                    cssSelector = qry.query;
                }
                fragment.querySelectorAll(cssSelector).forEach(async (node) => {
                    await this.#processEl(node, key, make);
                });
            }
        }
    }
    async #processEl(matchingEl, key, make) {
        const { makeItBe } = await import('trans-render/lib/makeBe.js');
        makeItBe(matchingEl, key, make);
    }
}
const hasCapitalLetterRegExp = /[A-Z]/;
const tagName = 'be-having';
const ifWantsToBe = 'having';
const upgrade = 'script';
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            forceVisible: ['script'],
            virtualProps: ['make', 'loadScript', 'scope', 'readyToObserve'],
            proxyPropDefaults: {
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

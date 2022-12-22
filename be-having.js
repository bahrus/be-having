import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeHaving extends EventTarget {
    #observer;
    #queries = new Map();
    async makeBe(pp) {
        const { make, self } = pp;
        const rootNode = self.getRootNode();
        this.#observer = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(async (node) => {
                    if (!(node instanceof Element))
                        return;
                    for (const key in make) {
                        const rule = make[key];
                        //TODO - memoize
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
                            await this.#processEl(node, rule, make);
                        }
                    }
                });
            });
        });
        this.#observer.observe(rootNode, {
            childList: true,
            subtree: true,
        });
        for (const key in make) {
            let cssSelector = key;
            const rule = make[key];
            if (hasCapitalLetterRegExp.test(key)) {
                if (!this.#queries.has(key)) {
                    const { getQuery } = await import('trans-render/lib/specialKeys.js');
                    this.#queries.set(key, getQuery(key));
                }
                const qry = this.#queries.get(key);
                cssSelector = qry.query;
            }
            rootNode.querySelectorAll(cssSelector).forEach(async (node) => {
                await this.#processEl(node, key, make);
            });
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
            virtualProps: [],
            proxyPropDefaults: {}
        },
        actions: {
            makeBe: 'make'
        },
    },
    complexPropDefaults: {
        controller: BeHaving,
    }
});
register(ifWantsToBe, upgrade, tagName);

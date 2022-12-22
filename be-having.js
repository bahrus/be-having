import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeHaving extends EventTarget {
    makeBe(pp) {
    }
}
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

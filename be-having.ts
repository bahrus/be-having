import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, PPE, VirtualProps, Proxy, ProxyProps, PPP} from './types';

export class BeHaving extends EventTarget implements Actions{
    makeBe(pp: PP){

    }
}

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
            virtualProps: [],
            proxyPropDefaults:{

            }
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

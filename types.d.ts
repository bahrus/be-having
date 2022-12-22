import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';
import {CSSSelectorBeHavingMap} from 'trans-render/lib/types';
export interface EndUserProps{
    make: CSSSelectorBeHavingMap
}

export interface  VirtualProps extends EndUserProps, MinimalProxy{

}

export type Proxy = Element & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export type PPP = Partial<ProxyProps>;

export type PPE = [PPP, EventConfigs<Proxy, Actions>];

export interface Actions{
    makeBe(pp: PP): void;
}
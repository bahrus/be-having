import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';
import {CSSSelectorBeHavingMap, Scope} from 'trans-render/lib/types';
export interface EndUserProps{
    make?: CSSSelectorBeHavingMap,
    loadScript?: boolean,
    scope?: Scope,
}

export interface  VirtualProps extends EndUserProps, MinimalProxy{
    readyToObserve: boolean,
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
    makeSelfBeExportable(pp: PP): PPP | PPE;
    importMake(pp: PP): Promise<PPP | PPE>;
    doImports(pp: PP): Promise<void>;
    setReadyToObserve(pp: PP): PPP;
}



export interface ImportConfig {
    impl: string | string[]; 
}
import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';
import {CSSSelectorBeHavingMap, Scope} from 'trans-render/lib/types';
export interface EndUserProps{
    make?: CSSSelectorBeHavingMap,
    loadScript?: boolean,
    scope?: Scope,
}

export interface  VirtualProps extends EndUserProps, MinimalProxy<HTMLScriptElement>{
    readyToDoPreReqs: boolean;
    readyToMakeBe: boolean,
}

export type Proxy = HTMLScriptElement & VirtualProps;

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
    doPreReqImports(pp: PP, mold: PPP): Promise<PPP>;
    doAsyncImports(pp: PP): Promise<void>;
    setReadyToMakeBe(pp: PP, mold: PPP): PPP;
}



export interface ImportConfig {
    impl: string | string[]; 
    /** Don't start applying the make rule until this resource has finished loading. */
    await?: boolean;// [TODO];
}
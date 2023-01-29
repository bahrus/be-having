export async function match(newElement: Element): Promise<boolean>{
    const rn = newElement.getRootNode() as DocumentFragment;
    const matchingEl = rn.getElementById(newElement.localName);
    if(matchingEl !== null){
        return true;
    }
    //TODO:  optimize / memoize this
    const host = (<any>rn).host;
    if(!(host instanceof Element)) return false;
    const {localName} = host;
    if(localName.indexOf('-') === -1) return false;
    await customElements.whenDefined(localName);
    return typeof (<any>host)[`<${localName}`] === 'function';
}
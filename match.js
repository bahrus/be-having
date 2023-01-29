export async function match(newElement) {
    const rn = newElement.getRootNode();
    const matchingEl = rn.getElementById(newElement.localName);
    if (matchingEl !== null) {
        return true;
    }
    //TODO:  optimize / memoize this
    const host = rn.host;
    if (!(host instanceof Element))
        return false;
    const { localName } = host;
    if (localName.indexOf('-') === -1)
        return false;
    await customElements.whenDefined(localName);
    return typeof host[`<${localName}`] === 'function';
}

export async function match(newElement: Element){
    const rn = newElement.getRootNode() as DocumentFragment;
    rn.getElementById(newElement.localName);
}
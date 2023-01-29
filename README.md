# be-having

[![NPM version](https://badge.fury.io/js/be-importing.png)](http://badge.fury.io/js/be-having)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-having?style=for-the-badge)](https://bundlephobia.com/result?p=be-having)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-having?compression=gzip">

## Apply element decorators / behaviors from a distance.

*be-having* allows us to have our cake and eat it too.  Let me explain.

A particular conundrum of modern web development, as I see it, has to do with the proper role two missing pieces of the platform should play -- custom attributes / decorators / behaviors, and its relationship to  declarative template instantiation.

This dilemma is expounded on in [great detail here](https://github.com/bahrus/trans-render#extending-tr-dtr-horizontally), and the syntax be-having supports is identical to what is outlined in that dissertation.

In a nutshell, be-having allows us to consolidate lots of little inline binding of [custom attributes](https://github.com/bahrus/be-decorated), into one, centralized (JSON) blob.  This has the following advantages:

1.  It becomes economical to edit the JSON blob as a single *make.mjs file, which, with the help of a build process, can be converted into a JSON import.  Even better, we can benefit from compile time checks, autosuggest editing if we use a *.make.mts during development, which TypeScript compiles into *.make.mjs, and then some [separate process](https://github.com/bahrus/may-it-be) compiles to a JSON blob file (make.json?).
2.  This blob can be shared, and parsed once, in the case that the template it enhances is repeated multiple times throughout the page, which is often the case with web components.
3.  The "non-verbal" spells defined by the make definition can be applied during template instantiation, if the dependencies have been loaded already (ideally), but if not, *Ein Ba’aya*, just apply the rules to the live DOM tree after template instantiation has completed (and the dependencies have finished loading post instantiation).

Unfortunately, support for JSON module imports, across browsers, is coming slower than I would have ever expected, so the extra energy required to be backwards compatible doesn't seem worth it for now.  But please do apply a little "magical futuristic extrapolation" in the following discussion, when we talk about "make.ts." The end goal is for that file to be JSON, not JavaScript.

be-having is a central player in supporting declarative custom elements.

## Real world examples:

Side Nav (drawer component):

[html](https://github.com/bahrus/xtal-side-nav/blob/baseline/xtal-side-nav.html)
[make.ts](https://github.com/bahrus/xtal-side-nav/blob/baseline/make.ts)

Toggle Element:

[html](https://github.com/bahrus/plus-minus/blob/baseline/plus-minus.html)
[make.ts](https://github.com/bahrus/plus-minus/blob/baseline/make.ts)

Tree Context Menu:

[html](https://github.com/bahrus/tree-context/blob/baseline/tree-context.html)
[make.ts](https://github.com/bahrus/tree-context/blob/baseline/make.ts)

Declarative-ish element that requires a little custom JavaScript in the class:

[html, with the class defined within the script tag](https://github.com/bahrus/xtal-fig/blob/baseline/parallelogram/make.ts)
[make.ts ](https://github.com/bahrus/xtal-fig/blob/baseline/parallelogram/root.html)

Declarative-ish element that requires a little custom JavaScript in the class, using tertiary file:

[html, with minimal clutter](https://github.com/bahrus/xtal-fig/blob/baseline/diamond/root.html)
[make.ts ](https://github.com/bahrus/xtal-fig/blob/baseline/diamond/make.ts)
[Diamond.ts](https://github.com/bahrus/xtal-fig/blob/baseline/diamond/DiamondVM.ts)

## Lingo

The following example is a better introduction than the links above, in that the problem space it is solving is much smaller

```html
<script nomodule be-having='{
    "make": {
        "button": {
            "be": "counted",
            "having": {
                "transform": 
            }
        },
        "form": {
            "be": "reformable",
            "having": "formHavingProps"
        }
    }
}'> 
    import 'be-reformable/be-reformable.js';
    import 'be-counted/be-counted.js';
    
    import {make} from 'my-package/make.js';

    //someday (sigh), when the other two browsers finally implement json modules, can switch to json
    export const make = ['my-package/make.js', 'https://esm.run/my-package@0.0.123/make.js']; 
    export const counted = {
        impl:  'be-counted/be-counted.js';
    };
    export const reformable = {
        impl: ['be-reformable/be-reformable.js', 'https://esm.run/be-reformable@0.0.23']
    }

    export const formHavingProps = {
        
    };
</script>
```

## Awaiting [Untested]

There are some scenarios where we really would rather wait for one or more dependencies to finish loading before proceeding with the instructions defined in the make file.

To enable this, set await to true:

```JavaScript
export const inquiring = {
    impl: ['be-inquiring/be-inquiring.js', 'https://esm.run/be-inquiring@1.2.3/be-inquiring.js'],
    await: true,
}
```

## Linking Tags to Templates or host methods (for example)

be-having supports a special selector:

"<>": 

What this does: An element matches this selector if:

1.  There exists an element whose id matches the tag name in the Shadow DOM realm. or
2.  If the tag name matches a method name of the host, surrounded by angle brackets

be-having will also remove attribute href if the element doesn't natively support the href property.  This allows developers to benefit from a little DX assistance, by adding href="#[id]" to the tag.  VS Code (and hopefully most decent HTML editors) provide support for jumping to the element.  



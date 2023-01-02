# be-having

be-having allows us to have our cake and eat it too.  Let me explain.

A particular conundrum of modern web development, as I see it, has to do with the proper role two missing pieces of the platform should play -- custom attributes / decorators / behaviors, and its relationship to  declarative template instantiation.

This dilemma is expounded on in [great detail here](https://github.com/bahrus/trans-render#extending-tr-dtr-horizontally), and the syntax be-having supports is identical to what is outlined in that dissertation.

In a nutshell, be-having allows us to consolidate lots of little inline binding of [custom attributes](https://github.com/bahrus/be-decorated), into one, centralized (JSON) blob.  This has the following advantages:

1.  It becomes economical to edit the JSON blob as a single *make.mjs file, which, with the help of a build process, can be converted into a JSON import.  Even better, we can benefit from compile time checks, autosuggest editing if we use a *.make.mts during development, which TypeScript compiles into *.make.mjs, and then some [separate process](https://github.com/bahrus/may-it-be) compiles to a JSON blob file (make.json?).
2.  This blob can be shared, and parsed once, in the case that the template it enhances is repeated multiple times throughout the page, which is often the case with web components.
3.  The "non-verbal" spells defined by the make definition can be applied during template instantiation, if the dependencies have been loaded already (ideally), but if not, no sweat, just apply the rules to the live DOM tree after template instantiation has completed (and the dependencies have finished loading post instantiation).



Apply element decorators / behaviors from a distance.

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

    //someday (sigh), when the other two finally implement json modules, can switch to json
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

Want to use this for server-rendered first instance of webcomponent, packaged in some way 
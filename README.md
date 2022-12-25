# be-having

[TODO] Document this coherently

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
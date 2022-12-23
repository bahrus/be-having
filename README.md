# be-having

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
    import 'be-reformable/be-reformable.js'
    //lazy load, multiple tries
    export const counted = {
        impl:  () => import('be-counted/be-counted.js');
    };
    export const reformable = {
        impl: [() => import('be-reformable/be-reformable.js'), () => import('https://esm.run/be-reformable@0.0.23')]
    }

    export const formHavingProps = {
        
    }
</script>
```

Want to use this for server-rendered first instance of webcomponent, packaged in some way 
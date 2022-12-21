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
            "be": "reformable"
        }
    }
}'> 
    import 'be-reformable/be-reformable.js'
    //lazy load
    export const counted = {
        impl:  () => import('be-counted/be-counted');
    }
</script>
```

Want to use this for server-rendered first instance of webcomponent, packaged in some way 
# VTEX-GuerraShelfLoader
VTEX extension to load products on same page


## USAGE
```html
<script src="/arquivos/jquery-cookie.js"></script>
<script src="/arquivos/guerra-shelf-loader"></script>
```

```js
$(document).ready(function(){
    $('div[id*="ResultItems"]').guerraShelfLoader();
});
```
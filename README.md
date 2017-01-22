## Enchanter

Enchanter is a minimalistic site generator, build up your site on an easy way

```js
var enchanter = require('express')
var app = enchanter()

app.page('/', function(ctx) {
    // do some mongodb queries :)
    ctx.render('template', {title: "home", message: "body"});
});

app.generate();
```

## Installation

```bash
$ npm install express
```
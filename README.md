## Enchanter

Enchanter is a minimalistic site generator, build up your site on an easy way

```js
var enchanter = require('express')
var app = enchanter()

app.page('/', function(ctx) {
    // do some mongodb queries :)
    ctx.render('template', {title: "home", message: "body"});
});

app.generateAll();
```

You can also generate a specific path with the following code:

```js
app.generate('/');

app.generate('/about');
```

## Installation

```bash
$ npm install enchanter
```
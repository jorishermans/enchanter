## Basic example

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
$ npm install enchanter
```
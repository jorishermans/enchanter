## Enchanter

Enchanter is a minimalistic site generator, build up your site on an easy way.
Following a part of the api of express.js.

```js
var enchanter = require('enchanter');
var app = enchanter();

app.page('/', function(request, response) {
    // do some mongodb queries :)
    response.render('template', {title: "home", message: "body"});
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
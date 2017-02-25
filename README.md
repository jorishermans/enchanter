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

## Use express

Generate a site with express as parameter. 

```js
var enchanter = require('enchanter');
var express = require(express);

var app = enchanter(express);
```
When you start your application with 
```
node index -d
```
It will start the application with express. 
This should be easy while your are developing your application or you want a dynamic and a static generation part.

## Events

after - happens at the end of a generate phase.

```js
app.on('after', (page) => {
    console.log('end generating ...');
});
```

## Issues

Please fill an issue when a part of the express api is not covered for you use case!
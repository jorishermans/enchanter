var Enchanter = require('..');

var pug = require('pug');

console.log(pug);
console.log(Enchanter);

var app = new Enchanter();

app.set('views', './views');
app.set('output', './output');
app.set('view engine', 'pug');
app.set('view module', require('pug'));

// render the homepage 
app.get('/', function(ctx) {
    ctx.render('template', {title: "home", pagetitle:"start", message: "Welcome to the homepage!"});
});

// render page two 
app.get('/two', function(ctx) {
    ctx.render('template', {title: "page two", pagetitle:"Two", message: "Welcome to the second page of this site!"});
});

app.generate();
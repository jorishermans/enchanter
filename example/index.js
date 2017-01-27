const Enchanter = require('..');

const pug = require('pug');
const yaml = require('js-yaml');
const fs = require('fs');

console.log(pug);
console.log(Enchanter);

var app = new Enchanter();

app.set('views', './views');
app.set('output', './output');
app.set('view engine', 'pug');
app.set('view module', require('pug'));

// site config data
const config = {};
try {
    const config = yaml.safeLoad(fs.readFileSync('site.yml', 'utf8'));
} catch (e) {
    console.log(e);
}

// render the homepage 
app.get('/', function(ctx) {
    fs.readdir( './data', (err, files) => {
        if (err) return;

        var links = [];
        for (var file of files) {
            file = file.replace('.md', '')
            links.push({url: '/article/' + file, name: file.replace(new RegExp('-', 'g'), " ")});
        }
        ctx.render('home', {title: "home", pagetitle:"start", links: links, site: config, message: "Welcome to the homepage!"});
    });
});

// render articles
app.get('/two', function(ctx) {
    ctx.render('template', {title: "page two", pagetitle:"Two", site: config, message: "Welcome to the second page of this site!"});
});

app.generateAll();
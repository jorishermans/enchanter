const enchanter = require('..');
const express = require('express');

const pug = require('pug');
const yaml = require('js-yaml');
const marked = require('marked');
const fs = require('fs');

var app = enchanter(express);

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
app.get('/', function(req, res) {
    fs.readdir( './data', (err, files) => {
        if (err) return;

        var links = [];
        for (var file of files) {
            file = file.replace('.md', '')
            links.push({url: '/article/' + file, name: file.replace(new RegExp('-', 'g'), " ")});

            if (app.generate) app.generate(`/article/${file}`);
        }
        res.render('home', {title: "home", pagetitle:"start", links: links, site: config, message: "Welcome to the homepage!"});
    });
});

// render articles
app.get('/article/:page', function(req, res) {
    let page = req.params.page;
    let title = page.replace(new RegExp('-', 'g'), " ");
    fs.readFile( `./data/${page}.md`, 'utf-8', (err, result) => {
        if (err) res.write('no article found!');

        res.render('template', {title: "Article - " + title, pagetitle:title, site: config, content: marked(result)});
    });
});

// render articles
app.get('/two', function(req, res) {
    res.render('template', {title: "page two", pagetitle:"Two", site: config, message: "Welcome to the second page of this site!"});
});

if (app.generate) 
    app.generate('/');
else 
    app.listen(8080);
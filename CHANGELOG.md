## 1.3.0

* Generate a site with express as parameter. 

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

* You can now generate files in directories. 

## 1.2.0

Add the class request to this library.
Also adding the possibility to work with path variables.

## 1.1.0

Add the methods generate and generateAll into the application class.
With generate you can generate a specific page.

## 1.0.1

Add the methods all, get, post, del, put into the application class.

## 1.0.0

Initial version of enchanter to generate a static site!
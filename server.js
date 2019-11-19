var express = require('express');
var app = express();
var exStatic = require('express-static');
app.use(exStatic('./index.html'));
app.listen(80);
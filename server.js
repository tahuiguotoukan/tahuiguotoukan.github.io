var express = require('express');
var app = express();
var exStatic = require('express-static');
app.use(exStatic('./test.html'));
app.listen(80);
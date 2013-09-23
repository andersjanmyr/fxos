var express = require('express');

var app = express();
app.use(express.logger({format: 'dev'}));
app.use(express.static(__dirname + '/app'));
app.use(express.static(__dirname + '/.tmp'));
app.listen(process.env.PORT || 3000);

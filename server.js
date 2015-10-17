var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
const PORT = require('./config/server_config.js').PORT;
var morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function (request, response, next) {
	response.header('Access-Control-Allow-Origin', '*')
	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next();
});

mongoose.connect(configDB.url);

require('./app/routes.js')(app);

app.listen(PORT);
console.log('Shipsoft Server listen at port ' + PORT);

var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

var PurchController = require('./user/purches/PurchController');
app.use('/purches', PurchController);

var StockController = require('./user/stock/StockController');
app.use('/stock', StockController);

module.exports = app;
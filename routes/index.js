var express = require('express');
var router = express.Router();

const AWS = require("aws-sdk")
AWS.config.update({ region: "us-east-1" })
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const persistence_support = require('../modules/persistence_support');

// '/'
router.get('/', function(req, res, next) {
  res.render('index', { description: 'Index', jay_son: {x:3} } );
});

// '/empty_promise'
router.get('/simple_promise', function(req, res, next) {
  persistence_support.simplePromise().then( function(obj) {
    res.render('index', { description: 'Simple Promise', jay_son: obj });
  });
});

// '/manufacturer'
router.get('/manufacturer', function(req, res, next) {
  var params = { Key: { "name": req.query.name_str }, TableName: "d_bike_manufacturer" };
  dynamoDB.get(params).promise().then( function(obj) {
    res.render('index', { description: 'Single DynamoDB Item', jay_son: obj });
  });
});

module.exports = router;

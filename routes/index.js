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

// '/manufacturers_best_bike'
router.get('/manufacturers_best_bike', function(req, res, next) {
  var params = { Key: { "name": req.query.name_str }, TableName: "d_bike_manufacturer" };
  dynamoDB.get(params).promise().then( function(obj) {
    if (Object.keys(obj).length==0) {
      res.render('index', { description: 'Consecutive DynamoDB Items', jay_son: {err: "not found"} } );
      return;
    }

    var bikeName = obj.Item.best_bike;
    var params2 = { Key: { "model_name": bikeName }, TableName: "d_bike_model" };
    dynamoDB.get(params2).promise().then( function(obj2) {
      res.render('index', { description: 'Consecutive DynamoDB Items', jay_son: obj2 });
    });
  });
});

module.exports = router;

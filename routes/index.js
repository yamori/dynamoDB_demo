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

// '/manufacturer_and_bike'
router.get('/manufacturer_and_bike', function(req, res, next) {
  
  // Two query params
  var params = { Key: { "name": req.query.name_str }, TableName: "d_bike_manufacturer" };
  var params2 = { Key: { "model_name": req.query.bike_str }, TableName: "d_bike_model" };

  var promises_arr = [
    dynamoDB.get(params).promise(),
    dynamoDB.get(params2).promise()
  ];

  Promise.all(promises_arr).then( function(obj) {
    res.render('index', { description: 'Promise.all() for Concurrency', jay_son: obj } );
  });
});

// '/manufacturers' (batch get)
router.get('/manufacturers', function(req, res, next) {
  var manufTableName = "d_bike_manufacturer";
  var manufacturers_array = req.query.names_str.split(",");
  var bikeTableName = "d_bike_model";
  var bikes_array = req.query.bikes_str.split(",");

  var params = { RequestItems: {} };
  params.RequestItems[manufTableName] = {Keys: []};
  for (manufacturer_name of manufacturers_array) {
    params.RequestItems[manufTableName].Keys.push( { name: manufacturer_name } );
  }
  params.RequestItems[bikeTableName] = {Keys: []};
  for (bike_name of bikes_array) {
    params.RequestItems[bikeTableName].Keys.push( { model_name: bike_name } );
  }
  console.log(JSON.stringify(params,null,2));

  dynamoDB.batchGet(params).promise().then( function(obj) {
    res.render('index', { description: 'DynamoDB BatchGet', jay_son: obj });
  });
});

module.exports = router;

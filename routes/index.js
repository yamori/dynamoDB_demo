var express = require('express');
var router = express.Router();

const persistence_support = require('../modules/persistence_support');

// '/'
router.get('/', function(req, res, next) {
  res.render('index', { description: 'Index', jay_son: {x:3} } );
});

// '/empty_promise'
router.get('/simple_promise', function(req, res, next) {
  persistence_support.simplePromise().then( function(obj) {
    res.render('index', { description: 'Index', jay_son: obj });
  });
});

module.exports = router;

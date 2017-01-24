//
//  server.js
//  created 2/12/2016
//  Antoine GALPIN server
//

/* TOOLS */
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var app = express()

/* AFF */
console.log("*****************************************\n\* Antoine_server is working on dev mode *\n\*                                       *\n\*     It's Antoine personal server      *\n\*                                       *\n\*****************************************\n");

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());

/* MYSQL Connection */
var connection  = require('express-myconnection')
var mysql = require('mysql');
app.use(connection(mysql, {
    host     : 'localhost',
    port     : 8889,
    user     : 'root',
    password : 'root',
    database : 'antoine_db',
    debug    : false //set true if you wanna see debug logger
  },'request')
);

/* Setup all headers in all routes */
app.all('/*', function(req, res, next) {
  /**
   * Response settings
   * @type {Object}
   */
  var responseSettings = {
      "AccessControlAllowOrigin": req.headers.origin,
      "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
      "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
      "AccessControlAllowCredentials": true
  };

  /* HEADERS */
  res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
  res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
  res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
  res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

  if ('OPTIONS' == req.method) {
      res.send(200);
  }
  else {
      next();
  }
});

/* EXPRESS ROUTE*/
var router = express.Router();

router.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

/* CURRENT ROUTE SERVER */
var serverUser = require('./serverUser');
var curentRoute = router.route('/user');
serverUser.configureSingleGetRoute(curentRoute);
serverUser.configureSinglePostRoute(curentRoute);
/* ROUTE FOR UPDATE AND DELETE ELEMENTS */
var curentRouteWithId = router.route("/user/:id/")
serverUser.configureSinglePutRoute(curentRouteWithId);
serverUser.configureSingleDeleteRoute(curentRouteWithId);

/* Apply our router in API route */
app.use('/api', router);

/* LAUNCH SERVER */
var server = app.listen(4000, function() {
  console.log("Server working with %s port", server.address().port);
});

exports.server = server;

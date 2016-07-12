var express = require('express');
// var https = require('https');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
// var fs = require('fs')

// var privateKey  = fs.readFileSync('sslcert/ktjr.com.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/ktjr.com.crt', 'utf8');
// var credentials = {key: privateKey, cert: certificate};
// var httpsServer = https.createServer(credentials, app);

// var router = express.Router();

var mockApi = require('./mock_api').mockApi;
// app.set('proxyHost', 'http://dev-pano.ktjr.com')
app.set('apiPrefix', '/api/v1')

// mockapi中间件放到bodyparser前面，否则由于代理的问题导致请求被挂起，类似的相关问题：
// https://github.com/nodejitsu/node-http-proxy/issues/180
// https://github.com/nodejitsu/node-http-proxy/issues/168#issuecomment-3289492
mockApi(app);
// app.use('/api/v1', router)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// load the cookie-parsing middleware
app.use(cookieParser());

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Mock server listening at http://%s:%s', host, port);
});

// httpsServer.listen(8443);

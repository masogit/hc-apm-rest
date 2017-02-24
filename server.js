var express = require('express');
var httpProxy = require('http-proxy');
var sites = require('./data/site');
var path = require('path');

// two server for set base root path
const base = process.env.APM_ROOT || "/apm";
var server = express();
var app = express(); 
var rest = express();
server.use(base, app);

app.use(express.static(path.join(__dirname, '/dist')));
var proxy = httpProxy.createProxyServer({secure: false});

proxy.on('error', function(e) {
  console.log(e);
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  console.log('proxyReq');
  console.log(proxyReq);
});

// ==================== Routers ========================

app.use(base, (req, res, next) => {
    next();
});

app.use('/dataget', rest);

rest.use('/site_info', (req, res) => {
    res.json(sites);
});

app.use('*', (req, res, next) => {
    next();
});

app.use('*', function (req, res, next) {
    express.static(__dirname + '/dist/index.html')
    // next();
});

server.listen(9000, function () {
  console.log('Example app listening on port 9000!')
});
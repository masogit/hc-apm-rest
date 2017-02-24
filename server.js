var express = require('express');
var httpProxy = require('http-proxy');
var sites = require('./data/site');

var app = express(); 
var proxy = httpProxy.createProxyServer({secure: false});

proxy.on('error', function(e) {
  console.log(e);
});

proxy.on('proxyReq', function(proxyReq, req, res, options) {
  console.log('proxyReq');
  console.log(proxyReq);
});

app.use('/dataget', function (req, res) {
    console.log('proxy working...');
    proxy.web(req, res, { target: `https://geapmuat2.run.aws-jp01-pr.ice.predix.io/web/dataget` });
});

app.use('/sites', (req, res) => {
    res.json(sites);
});

app.get('/*', function (req, res, next) {
    next();
});

app.listen(9000, function () {
  console.log('Example app listening on port 9000!')
});
var express = require('express');
var httpProxy = require('http-proxy');
var sites = require('./data/site');
var path = require('path');
var https = require('https');

// two server for set base root path
const base = process.env.APM_ROOT || "/apm";
var server = express();
var app = express(); 
var rest = express();


server.use(express.static(path.join(__dirname, '/dist')));
server.use(base, app);
server.use('*', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/dist/index.html'))
    // next();
});


var proxy = httpProxy.createProxyServer({secure: false});
proxy.on('error', function(e) {
  console.log(e);
});
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  console.log('proxyReq');
  console.log(options);
});

// ==================== Routers ========================

app.use(base, (req, res, next) => {
    next();
});

app.use('/dataget', rest);

function ssl(request, response) {
    var optionsget = {
        host : 'geapmuat2.run.aws-jp01-pr.ice.predix.io', // here only the domain name
        // (no http/https !)
        port : 443,
        path : '/web/dataget/site_info', // the rest of the url with parameters if needed
        method : 'GET' // do GET
    };

    var reqGet = https.request(optionsget, function(res) {
        console.log("statusCode: ", res.statusCode);
        // uncomment it for header details
    //  console.log("headers: ", res.headers);
    
    
        res.on('data', function(d) {
            console.info('GET result:\n');
            console.log(d.toString('utf8'));
            response.json(JSON.parse(d.toString('utf8')));
            // process.stdout.write(d);
            console.info('\n\nCall completed');
        });
    
    });
    
    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
};

rest.use('/site_info', ssl);
// rest.use('/site_info', (req, res) => {
//     // proxy.web(req, res, { target: `https://geapmuat2.run.aws-jp01-pr.ice.predix.io:443/web/dataget/site_info` });
//     proxy.web(req, res, { target: `https://httpbin.org:443/get` });
//     // res.json(sites);
// });

// app.use('*', (req, res, next) => {
//     next();
// });

app.use('*', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/dist/index.html'))
    // next();
});

server.listen(80, function () {
  console.log('Example app listening on port 80!')
});
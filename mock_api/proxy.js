var proxy = require('express-http-proxy')
var parse = require('url').parse
// var HttpsProxyAgent = require('https-proxy-agent')
var proxyHost = 'https://pano.ktjr.com'

// var corporateProxyServer = 'http://localhost:8888';
// if (corporateProxyServer) {
//     corporateProxyAgent = new HttpsProxyAgent(corporateProxyServer)
// }

// function setProxyAgent(req) {
//     if (corporateProxyAgent) {
//         req.agent = corporateProxyAgent
//     }
//     return req
// }

exports.proxyMidWare = proxy(proxyHost, {
    forwardPath: function(req, res) {
        return parse(req.url).path
    },
    // decorateRequest: setProxyAgent,
})

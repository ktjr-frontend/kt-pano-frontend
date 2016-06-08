var proxy = require('express-http-proxy');
var parse = require('url').parse

module.exports = function(app) {
    var host = app.get('proxyHost')
    var apiPrefix = app.get('apiPrefix')
    var proxyMidWare = proxy(host, {
        forwardPath: function(req, res) {
            return parse(req.url).path;
        }
    })

    app.get(apiPrefix + '/shadows', proxyMidWare)

    app.post(apiPrefix + '/feedbacks', proxyMidWare)
}

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

    app.get(apiPrefix + '/registrations/captcha', proxyMidWare)
    app.post(apiPrefix + '/registrations', proxyMidWare)
    app.put(apiPrefix + '/registrations', proxyMidWare)

    app.get(apiPrefix + '/sessions', proxyMidWare)
    app.post(apiPrefix + '/sessions', proxyMidWare)

    app.get(apiPrefix + '/accounts/:type', proxyMidWare)
    app.put(apiPrefix + '/accounts/:type', proxyMidWare)

    app.put(apiPrefix + '/recoveries', proxyMidWare)
    app.get(apiPrefix + '/recoveries/:type', proxyMidWare)
    app.put(apiPrefix + '/recoveries/:type', proxyMidWare)

}

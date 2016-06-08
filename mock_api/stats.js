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

    app.get(apiPrefix + '/stats/settings', proxyMidWare)

    app.get(apiPrefix + '/stats/overview', proxyMidWare)

    app.get(apiPrefix + '/stats/detail', proxyMidWare)

    app.get(apiPrefix + '/stats/rate_trend', proxyMidWare)

    app.get(apiPrefix + '/compass_assets', proxyMidWare)

    app.get(apiPrefix + '/compass_assets/settings', proxyMidWare)

    app.get(apiPrefix + '/fame_assets', proxyMidWare)

    app.get(apiPrefix + '/fame_assets/settings', proxyMidWare)

    app.get(apiPrefix + '/asset_intentions', proxyMidWare)

}

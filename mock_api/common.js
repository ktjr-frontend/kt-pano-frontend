var proxyMidWare = require('./proxy').proxyMidWare

module.exports = function(app) {
    var apiPrefix = app.get('apiPrefix')

    app.get(apiPrefix + '/shadows', proxyMidWare)

    app.post(apiPrefix + '/feedbacks', proxyMidWare)
}

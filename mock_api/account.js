var proxy = require('express-http-proxy');
var parse = require('url').parse
var Mock = require('mockjs')

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

    // app.get(apiPrefix + '/sessions', proxyMidWare)
    app.get(apiPrefix + '/sessions', function(req, res, next) {
        var data = Mock.mock({
            'account': {
                'email': 'wangguochao@baidu.com',
                'company': 'wangguochao',
                'job': 'it',
                'department': 'it',
                'mobile': 15210569227,
                'name': 'wangguochao',
                'invitee_code': 'WZKQCG',
                'refilled': 'true',
                'role': 'rejected',
                'invitee_limit': 5,
                'invitee_count': 0
            }
        })
        res.json(data)
    })
    app.post(apiPrefix + '/sessions', proxyMidWare)

    app.get(apiPrefix + '/accounts/:type', proxyMidWare)
    app.put(apiPrefix + '/accounts/:type', proxyMidWare)

    app.put(apiPrefix + '/recoveries', proxyMidWare)
    app.get(apiPrefix + '/recoveries/:type', proxyMidWare)
    app.put(apiPrefix + '/recoveries/:type', proxyMidWare)

}

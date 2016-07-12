var proxyMidWare = require('./proxy').proxyMidWare
var Mock = require('mockjs')

module.exports = function(app) {
    var apiPrefix = app.get('apiPrefix')

    app.get(apiPrefix + '/registrations/captcha', proxyMidWare)
    app.post(apiPrefix + '/registrations', proxyMidWare)
    app.put(apiPrefix + '/registrations', proxyMidWare)

    app.get(apiPrefix + '/sessions', proxyMidWare)
    app.post(apiPrefix + '/sessions', proxyMidWare)
    // app.get(apiPrefix + '/sessions', function(req, res, next) {
    //     var data = Mock.mock({
    //         'account': {
    //             'email': 'wangguochao@baidu.com',
    //             'company': 'wangguochao',
    //             'job': 'it',
    //             'department': 'it',
    //             'mobile': 15210569227,
    //             'name': 'wangguochao',
    //             'invitee_code': 'WZKQCG',
    //             'refilled': 'true',
    //             'role': 'initialized',
    //             'invitee_limit': 5,
    //             'business_card': '/images/logo-new.svg',
    //             'invitee_count': 0
    //         }
    //     })
    //     res.json(data)
    // })

    app.get(apiPrefix + '/cards', proxyMidWare)
    app.post(apiPrefix + '/cards', proxyMidWare)
    app.put(apiPrefix + '/cards/:confirm', proxyMidWare)

    app.get(apiPrefix + '/accounts/:type', proxyMidWare)
    app.put(apiPrefix + '/accounts/:type', proxyMidWare)

    app.put(apiPrefix + '/recoveries', proxyMidWare)
    app.get(apiPrefix + '/recoveries/:type', proxyMidWare)
    app.put(apiPrefix + '/recoveries/:type', proxyMidWare)

}

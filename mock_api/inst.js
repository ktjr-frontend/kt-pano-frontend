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

    app.get(apiPrefix + '/institutions/:id', proxyMidWare)

    /*---mock data---*/
    /*app.get(apiPrefix + '/institutions/:id', function(req, res, next) {
        var data = Mock.mock({
            'institution': {
                'id': 1,
                'name': '@ctitle',
                'desc': '@cparagraph',
                'ipo|1': ['是', '否'],
                'landline|': 11111111111,
                'address': '@county(true)',
                'email': '@email',
                'website': 'https://www.wjs.com',
                'logo': 'https://www.wjs.com/themes/web/images/base/logo.png',
                'business_model': '@cword(3,6)',
                'asset_types|4': ['@cword(3,6)'],
                'assets|8-16': ['@cword(4,7)'],
                'parters|5': [
                    '@ctitle',
                ],
                'notices|5': [{
                    name: '@csentence',
                    url: '@url(http)'
                }],
                'members|4-10': [{
                    name: '@cname',
                    job: '@cword(3,6)'
                }],
                'shareholders|3-6': [{
                    name: '@cname',
                    type: '@cword(3,6)'
                }],
                'reports|3-6': [{
                    name: '@cword(6,10)',
                    url: '@url(http)'
                }],
                'license': {
                    'name': '@ctitle', //type: String#机构全称
                    'license_code': '@guid', //type: String#统一社会信用代码/注册号
                    'org_code': '@id', //type: String#机构编码
                    'legal_person': '@cname', //type: String#法人
                    'nature': '@cword(5,6)', //type: String#企业性质
                    'range': '@cword(8,11)', //type: String#经营范围
                    'established_at': '@date', //type: Date#成立日期
                    'start_at': '@date', //type: Date#营业期限
                    'end_at': '@date', //type: Date#营业期限
                    'authority': '@cword(5,15)', //type: String#登记机关
                    'address': '@county(true)', //type: String#注册地址
                    'capital|10000-1000000': 1, //type: String#注册资本
                    'endless_duration|1': ['是', '否'], //type: Boolean#无固定期限
                    'duration|100-365': 1
                },

            }
        })
        res.json(data)
    })*/

}

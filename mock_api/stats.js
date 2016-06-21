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


    // 总览页
    app.get(apiPrefix + '/stats/overview', proxyMidWare)
        // app.get(apiPrefix + '/stats/notices', proxyMidWare)

    // 资产类型的发行量-收益率统计图
    app.get(apiPrefix + '/stats/overview_mock', function(req, res, next) {
        var data = Mock.mock({
            "stat": {
                "xAxis": ["2016-02-21", "2016-02-28", "2016-03-07", "2016-03-14", "2016-03-21", "2016-03-28", "2016-04-04", "2016-04-11", "2016-04-18", "2016-04-25", "2016-05-02", "2016-05-09", "2016-05-16", "2016-05-23", "2016-05-30", "2016-06-06", "2016-06-13", "2016-06-20"],
                "data|7": [{
                    "name|+1": ["企业借款类", "供应链类", "小微金融类", "房地产类", "政信类", "票据类", "金融工具类"],
                    "amount|18": ['@integer(0, 10000000000)'],
                    "rate|18": ['@float(3,15,2)']
                }]
            },
            "crawled_at": "2016-06-20 00:00:00"
        })
        res.json(data)
    })

    // 推荐产品
    app.get(apiPrefix + '/stats/overview_products', function(req, res, next) {
        var data = Mock.mock({
            compass_assets_bond: {
                recommend_resion: '@cword(5,20)',
                'list|3': [
                    {
                        id: '@id',
                        name: '@cword(3,10)',
                        link: '@url(http)',
                        life: '@integer(1,2)个月',
                        rate: '@float(4,15,2)',
                        sum_amount: '@integer(10000000,10000000000)',
                        from: '@cword(4,6)',
                        asset_type: '@cword(3,7)'
                    }
                ]
            },
            compass_assets_am: {
                recommend_resion: '@cword(5,20)',
                'list|3': [
                    {
                        id: '@id',
                        name: '@cword(3,10)',
                        link: '@url(http)',
                        life: '@integer(1,2)个月',
                        rate: '@float(4,15,2)',
                        from: '@cword(4,6)',
                        credit_manager: '@cword(5,10)',
                        manage_org: '@cword(7,20)'
                    }
                ]
            },
            fame_assets_bond: {
                recommend_resion: '@cword(5,20)',
                'list|3': [
                    {
                        id: '@id',
                        name: '@cword(3,10)',
                        life: '@integer(1,2)个月',
                        rate: '@float(4,15,2)',
                        asset_type: '@cword(3,7)',
                        'guarantees|1-5':['@cword(2,6)']
                    }
                ]
            },
            fame_assets_am: {
                recommend_resion: '@cword(5,20)',
                'list|3': [
                    {
                        id: '@id',
                        name: '@cword(3,10)',
                        life: '@integer(1,2)个月',
                        rate: '@float(4,15,2)',
                        min_amount: '@integer(10000,100000)',
                        trustee: '@cword(4,6)',
                        manager: '@cword(5,15)'
                    }
                ]
            },
        })
        res.json(data)
    })

    app.get(apiPrefix + '/stats/notices', function(req, res, next) {
        var data = Mock.mock({
            'notices|0-5': [{
                name: '@cword(10,40)',
                url: '@url(http)',
                date: '@date',
                from: '@cword(3,7)'
            }]
        })
        res.json(data)
    })

    app.get(apiPrefix + '/stats/from_amounts', function(req, res, next) {
        var data = Mock.mock({
            'from_amounts|10': [{
                name: '@cword(4,8)',
                'amount|100000000-1000000000000': 1
            }]
        })
        res.json(data)
    })

    app.get(apiPrefix + '/stats/exchange_amounts', function(req, res, next) {
        var data = Mock.mock({
            'exchange_amounts|10': [{
                name: '@cword(5,10)',
                'amount|100000000-100000000000': 1
            }]
        })
        res.json(data)
    })

    app.get(apiPrefix + '/stats/reports', function(req, res, next) {
        var data = Mock.mock({
            'reports|0-5': [{
                name: '@cword(8,25)',
                url: '@url(http)'
            }]
        })
        res.json(data)
    })

    // 市场数据
    app.get(apiPrefix + '/stats/settings', proxyMidWare)
    app.get(apiPrefix + '/stats/detail', proxyMidWare)
    app.get(apiPrefix + '/stats/rate_trend', proxyMidWare)

    // 产品信息
    app.get(apiPrefix + '/compass_assets', proxyMidWare)
    app.get(apiPrefix + '/compass_assets/settings', proxyMidWare)

    // 可预约资产
    app.get(apiPrefix + '/fame_assets', proxyMidWare)
    app.get(apiPrefix + '/fame_assets/settings', proxyMidWare)
    app.get(apiPrefix + '/asset_intentions', proxyMidWare)

}

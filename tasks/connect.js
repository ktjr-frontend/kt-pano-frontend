var modRewrite = require('connect-modrewrite')
var gzip = require('connect-gzip')
var appConfig = {
    app: 'app',
    dist: 'dist'
}

// var server = 'http://dev-lode-zh.ktjr.com'
var server = 'http://10.132.1.12:3000'
    // var server = 'http://op-fame.ktjr.com'
var modRewriteUri = [
    // '^/mock_data/v\d{1,}/([^?]*).*$ /mock_data/$1 [L]',
    '^/(api/v\\d{1,}/.*)$ ' + server + '/$1 [P]',
    '^/(uploads/.*)$ ' + server + '/$1 [P]',
    '^/(.(?!\\.))*$ /index.html [L]',
    // '^/seallogo.dll.*$ /mock_data/seallogo.dll'
    // '^\/src/([^\\?]*)(?:\\?.*)?$ /Users/luxueyan/work/tanx-m-ssp/src/$1 [L]',
]

var sessionMidWare = function() {

    return function(req, res, next) {
        /*console.log(req.url)
        if (req.method === 'POST' && req.url.match(/\/ajax\/v\d\/sessions/)) {
            var resToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNTVhMWNhODY2OTVhMzJlYTUyMDAwMDAwIiwiZXhwIjoxNDM2NzU5NjA4fQ.2CwqRebKd8HPJlG0nAmYBal2eNgkbhgWLdw6Qp6Aix0'
            req.session.token = resToken
            res.end('{"token":"' + resToken + '"}')
        } else if (req.method === 'GET' && req.url.match(/\/ajax\/v\d\/users/)) {
            res.end('{"account":{"role": "admin","type": "loaner","name": "demo"}}')
        }*/

        var token = req.session.token

        if ((!token || !req.headers.authorization) && req.url.match(/sessions\.post\.json\??.*/)) {

            req.session.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNTVhMWNhODY2OTVhMzJlYTUyMDAwMDAwIiwiZXhwIjoxNDM2NzU5NjA4fQ.2CwqRebKd8HPJlG0nAmYBal2eNgkbhgWLdw6Qp6Aix0';

        } else if (req.url.match(/shadows\.[^?#]*json/) || req.url.match(/sessions\.post\.json\??.*/) || req.url.match(/registrations.*/)) {

            console.log('no need to authorize')

        } else if (req.url.match(/\.json\??\.*/) && !req.session.token) {

            res.writeHead(419, {
                'Content-Type': 'application/json'
            })

            res.end('{"error":"session expired"}')

        } else if (token && req.url.match(/\.json\??\.*/) && token !== req.headers.authorization) {

            res.writeHead(401, {
                'Content-Type': 'application/json'
            })

            res.end('{"error":"no token post"}')
        }

        // if (!req.url.match(/\.json\??|\/api\/v\d+|\/index\.html/g)) {
        //     res.setHeader("Cache-Control", "max-age=6000")
        // }

        return next()
    }

}
module.exports = {
    options: {
        port: 8888,
        hostname: '*',
        livereload: 35728
    },
    livereload: {
        options: {
            open: {
                target: 'http://localhost:8888',
            },
            middleware: function(connect) {

                return [
                    /**
                     * @author luxueyan
                     * 模拟服务器端环境，
                     * 1.第一次无token, session写入xsrf token 和用户登录状态
                     * 2.无token访问API接口 返回401错误
                     * 3.登录login过期以后返回419错误
                     */
                    connect.cookieParser(),
                    connect.session({
                        secret: 'jiami',
                        cookie: {
                            maxAge: 60 * 60 * 1000 * 24
                        }
                    }),

                    sessionMidWare(),

                    //mock data API
                    modRewrite(modRewriteUri),
                    connect.static('.tmp'),
                    connect().use(
                        '/bower_components',
                        connect.static('./bower_components')
                    ),
                    connect().use(
                        '/app',
                        connect.static('./app')
                    ),
                    connect.static(appConfig.app),
                ];
            }
        }
    },
    dist: {
        options: {
            livereload: false,
            open: {
                target: 'http://localhost:8888',
            },
            base: '<%= kt.dist %>',
            middleware: function() {
                return [
                    //mock data API0
                    function(req, res, next) {
                        if (!req.url.match(/\.json\??|\/api\/v\d+|\/index\.html|asset-rev.*\.js/g)) {
                            res.setHeader('Cache-Control', 'max-age=' + 60 * 60 * 24 * 365)
                        }
                        return next()
                    },
                    modRewrite(modRewriteUri),
                    gzip.staticGzip(appConfig.dist, {
                        matchType: /text|css|javascript|image|font/
                    }), //启用gzip
                    // connect.static(appConfig.dist),
                ]
            }
        }
    }
};

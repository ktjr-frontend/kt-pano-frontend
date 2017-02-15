var modRewrite = require('connect-modrewrite')
var gzip = require('connect-gzip')
var appConfig = {
    app: 'app',
    dist: 'dist'
}
var port = 8880
var livereloadPort = 35728

var server = 'http://dev-pano.ktjr.com'

// var server = 'http://pano.ktjr.com'
// var server = 'http://dev-op-pano.ktjr.com'
// var server = 'http://localhost:3000'
// var server = 'http://10.132.1.21:3000'

var modRewriteUri = [
    '^/(api/v\\d{1,}/.*)$ ' + server + '/$1 [P]',
    '^/(uploads/.*)$ ' + server + '/$1 [P]',
    '^/(.(?!\\.))*$ /index.html [L]',
]

// var sessionMidWare = function() {

//     return function(req, res, next) {

//         var token = req.session.token

//         if ((!token || !req.headers.authorization) && req.url.match(/sessions\.post\.json\??.*/)) {

//             req.session.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNTVhMWNhODY2OTVhMzJlYTUyMDAwMDAwIiwiZXhwIjoxNDM2NzU5NjA4fQ.2CwqRebKd8HPJlG0nAmYBal2eNgkbhgWLdw6Qp6Aix0';

//         } else if (req.url.match(/shadows\.[^?#]*json/) || req.url.match(/sessions\.post\.json\??.*/) || req.url.match(/registrations.*/)) {

//             console.log('no need to authorize')

//         } else if (req.url.match(/\.json\??\.*/) && !req.session.token) {

//             res.writeHead(419, {
//                 'Content-Type': 'application/json'
//             })

//             res.end('{"error":"session expired"}')

//         } else if (token && req.url.match(/\.json\??\.*/) && token !== req.headers.authorization) {

//             res.writeHead(401, {
//                 'Content-Type': 'application/json'
//             })

//             res.end('{"error":"no token post"}')
//         }

//         // if (!req.url.match(/\.json\??|\/api\/v\d+|\/index\.html/g)) {
//         //     res.setHeader("Cache-Control", "max-age=6000")
//         // }

//         return next()
//     }

// }
module.exports = {
    options: {
        port: port,
        hostname: '*',
        livereload: livereloadPort
    },
    livereload: {
        options: {
            open: {
                target: 'http://localhost:' + port,
            },
            middleware: function(connect) {

                return [
                    /**
                     * @author luxueyan
                     * 模拟服务器端环境，@deprecated 用mock-server.js替代
                     * 1.第一次无token, session写入xsrf token 和用户登录状态
                     * 2.无token访问API接口 返回401错误
                     * 3.登录login过期以后返回419错误
                     */
                    /*connect.cookieParser(),
                    connect.session({
                        secret: 'jiami',
                        cookie: {
                            maxAge: 60 * 60 * 1000 * 24
                        }
                    }),*/

                    // sessionMidWare(),

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
            port: 9999,
            livereload: false,
            open: {
                target: 'http://localhost:9999',
            },
            base: '<%= kt.dist %>',
            middleware: function() {
                return [
                    //mock data API0
                    /* function(req, res, next) {
                         if (!req.url.match(/\.json\??|\/api\/v\d+|\/index\.html|asset-rev.*\.js/g)) {
                             res.setHeader('Cache-Control', 'max-age=' + 60 * 60 * 24 * 365)
                         }
                         return next()
                     },*/
                    modRewrite(modRewriteUri),
                    // gzip.staticGzip(appConfig.dist, { //启用gzip
                    //     matchType: /text|css|javascript|image|font/
                    // }),
                    // connect.static(appConfig.dist),
                ]
            }
        }
    }
};

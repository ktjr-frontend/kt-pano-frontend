var path = require('path')
module.exports = {
    dist: {
        options: {
            map: [
                [
                    '/styles/(.*).css',
                    path.normalize(__dirname + '/..') + '/dist/styles/$1.css'
                ]
            ],
            ignore: [
                'fonts/Pe-icon-7-stroke.*', //目前不支持忽略字体，等待作者更新，所以先使用下面app 任务
                'fonts/fontawesome-webfont.*',
                'fonts/glyphicons-halflings-regular.*'
            ]
        },
        src: './dist/**/*.html'
    },
    app: {
        options: {
            map: [
                [
                    '/bower_components/(.*).css',
                    path.normalize(__dirname + '/..') + '/bower_components/$1.css'
                ],
                [
                    '/fonts/(.*).css',
                    path.normalize(__dirname + '/..') + '/app/fonts/$1.css'
                ],
                [
                    '/styles/(.*).css',
                    path.normalize(__dirname + '/..') + '/app/styles/$1.css'
                ]
            ],
            ignore: [
                'css/*.css',
                'styles/*.css',
                'dist/*.css',
                '!kt/css/kt-fonts.css'
            ]
        },
        src: './app/**/*.html'
    }
};

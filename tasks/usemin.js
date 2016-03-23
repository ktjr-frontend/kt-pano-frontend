module.exports = {
    options: {
        assetsDirs: [ //不支持通配符
            '<%= kt.dist %>',
            /*已经找到方法，在directive内的css引用图片时候使用绝对路径，grunt-usemin/lib/fileprocessor.js内有默认的 pattern*/
            // '<%= kt.dist %>/common/directives/icheck' //目前没有找到好的方法，如果directive有新增，这里需要新增搜索路径
        ],
        patterns: {
            // FIXME While usemin won't have full support for revved files we have to put all references manually here
            html: [
                [/(images\/[^'"']+?\.(?:gif|jpeg|jpg|png|webp|svg|ico|json))/gm, 'Update the html to reference our revved images'],
                // [/(views\/[^'"']+?\.(?:html))/gm, 'Update the html to reference our revved html'],
                [/((scripts|common)\/[^'"']+?\.(?:js))/gm, 'Update the html to reference our revved js'],
                [/((styles|common)\/[^'"']+?\.(?:css))/gm, 'Update the html to reference our revved css'],
            ],
            css: [
                [/((images|img)\/[^'"']+?\.(?:gif|jpeg|jpg|png|webp|svg|ico))/gm, 'Update the css to reference our revved images'],
                [/(fonts\/[^'"']+?\.(?:eot|svg|ttf|woff))/gm, 'Update the css to reference our revved fonts']
            ],
            js: [
                [/(images\/[^'"']+?\.(?:gif|jpeg|jpg|png|webp|svg|ico))/gm, 'Update the js to reference our revved images'],
                // [/(views\/.*?\.(?:html))/gm, 'Update the js to reference our revved html'] // 这里注释掉，是因为html模板用的ajax方式获取，所以在拦截器里面可以统一处理
            ]
        }
    },
    // html: ['<%= kt.dist %>/index.html']
    html: [
        '<%= kt.dist %>/views/**/*.html',
        '<%= kt.dist %>/index.html',
        '<%= kt.dist %>/common/directives/**/*.html',
        '<%= kt.dist %>/scripts/directives/**/*.html'
    ],
    css: [
        '<%= kt.dist %>/styles/*.css',
        '<%= kt.dist %>/common/directives/**/*.css',
        '<%= kt.dist %>/scripts/directives/**/*.css',
        '<%= kt.dist %>/views/**/*.css',
        '!<%= kt.dist %>/styles/vendor*.css'
    ],
    js: [
        '<%= kt.dist %>/common/**/*.js',
        '<%= kt.dist %>/scripts/**/*.js',
        '<%= kt.dist %>/views/**/*.js',
        '!<%= kt.dist %>/scripts/vendor*.js'
    ],
    // index: '<%= kt.dist %>/index.html',
};

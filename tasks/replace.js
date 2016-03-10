module.exports = {
    svgfont: {
        options: {
            patterns: [{
                match: /font-family="'STXihei'"/g,
                replacement: ''
            }, {
                match: /font-family="'FZLTCHJW--GB1-0'"/g,
                replacement: 'font-family="\'fzltchjt\'"'
            }]
        },
        files: [{
            expand: true,
            cwd: '<%= kt.app %>/svgs',
            src: ['**/*.svg', '!symbol/*.svg'],
            dest: '<%= kt.app %>/images'
        }]
    },
    baseUrl: {
        options: {
            patterns: [{
                match: /href="http:\/\/dev\.ktjr\.com:8000\/"/g,
                replacement: 'href="https://lode.ktjr.com"'
            }
            /*, {
                match: /\/mock_data\/seallogo\.dll/g,
                replacement: '//kxlogo.knet.cn/seallogo.dll'
            }*/
            ]
        },
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: ['index.html', 'views/common/home_footer.html'],
            dest: '<%= kt.dist %>'
        }]
    },
    fontsUrl: {
        options: {
            patterns: [{
                match: /\.\.\/\.\.\/([^\/]+\/fonts\/[^.]*?\.(?:eot|svg|ttf|woff))/g,
                replacement: '../fonts/$1'
            }]
        },
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: ['styles/style.css'],
            dest: '<%= kt.dist %>'
        }]
    },
    assetsJson: {
        options: {
            patterns: [{
                match: /(^[\s\S]*$)/g,
                replacement: 'window.assetsMap = $1;'
            }]
        },
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: ['scripts/assets-rev*.js'],
            dest: '<%= kt.dist %>'
        }]
    },
    appConfig: {
        options: {
            patterns: [{
                match: /\$compileProvider\.debugInfoEnabled\(\!0\)/g,
                replacement: '$compileProvider.debugInfoEnabled(!1)'
            }, {
                match: /\$ocLazyLoadProvider\.config\(\{debug\:\!0\}\)/g,
                replacement: '$ocLazyLoadProvider.config({debug:!1})'
            }]
        },
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: ['scripts/scripts.*js'],
            dest: '<%= kt.dist %>'
        }]
    }
};

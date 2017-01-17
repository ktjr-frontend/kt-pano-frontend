module.exports = {
    dist: {
        files: [{
                expand: true,
                dot: true,
                cwd: '<%= kt.app %>',
                src: [
                    '*.{ico,png,txt,xml}',
                    '.htaccess',
                    '*.{html,htm}',
                    'views/**/*.html',
                    'styles/img/*.*',
                    'images/**/*.*',
                    'download/**/*.*',
                    'common/libs/echarts.pano.min.js',
                    'common/libs/echarts.min.js',
                    // 'common/libs/qrcode.min.js',
                    'common/libs/html2canvas.min.js',
                    'common/directives/**/*.{jpg,png,jpeg,gif,svg,html}', //common目录用于异步加载
                    'scripts/directives/**/*.{jpg,png,jpeg,gif,svg,html}', //script目录下得diretive 用来异步加载
                    '!images/slice/**/*.*',
                    'mock_data/**/*.json'
                ],
                dest: '<%= kt.dist %>'
            }, {
                /*for ngannotate before uglify*/
                expand: true,
                cwd: '<%= kt.app %>',
                src: [
                    'scripts/controllers/**/*.js',
                    'views/**/*.js',
                    'scripts/directives/**/*.js',
                    'common/directives/**/*.js',
                    'common/factories/kt-captcha.js',
                ],
                dest: '<%= kt.dist %>'

            }, {
                expand: true,
                dot: true,
                cwd: 'bower_components/fontawesome',
                src: ['fonts/*.*'],
                dest: '<%= kt.dist %>'
            }, {
                expand: true,
                dot: true,
                cwd: 'bower_components/bootstrap',
                src: ['fonts/*.*'],
                dest: '<%= kt.dist %>'
            }, {
                expand: true,
                dot: true,
                cwd: 'app/fonts/pe-icon-7-stroke/',
                src: ['fonts/*.*'],
                dest: '<%= kt.dist %>'
            }, {
                expand: true,
                dot: true,
                cwd: 'app/fonts',
                src: ['pano/fonts/*.*'],
                dest: '<%= kt.dist %>/fonts'
            }, {
                expand: true,
                dot: true,
                cwd: 'app/common/fonts',
                src: ['pano/fonts/*.*'],
                dest: '<%= kt.dist %>/fonts'
            }, {
                expand: true,
                dot: true,
                cwd: '<%= kt.app %>/common',
                src: ['images/**/*.*'], //common 图片拷贝
                dest: '<%= kt.dist %>'
            },
            // , {
            //     expand: true,
            //     dot: true,
            //     cwd: 'app',
            //     src: ['mock_data/**/*.json'],
            //     dest: '<%= kt.dist %>'
            // }
        ]
    },
    dev: {
        files: [{ //用于开发环境
            expand: true,
            cwd: '<%= kt.app %>',
            dest: '.tmp',
            src: ['common/directives/**/*.{png,jpg,jpeg,gif,svg}']
        }, { //用于开发环境
            expand: true,
            cwd: 'bower_components/bootstrap/dist',
            dest: '.tmp',
            src: ['fonts/*.*']
        }, { //用于开发环境
            expand: true,
            cwd: '<%= kt.app %>/common',
            src: ['images/**/*.*'],
            dest: '.tmp'
        }]

    },
    hack: {
        files: {
            'dist/scripts/vendor.js': ['.tmp/concat/scripts/vendor.js']
        }
    }
};

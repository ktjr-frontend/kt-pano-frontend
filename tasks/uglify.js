module.exports = {
    forLazyLoad: {
        options: {
            mangle: true //混淆变量
        },
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: [
                'scripts/controllers/**/*.js',
                'views/**/*.js',
                'scripts/directives/**/*.js',
                'common/directives/**/*.js',
                'common/factories/kt-captcha.js',
            ],
            dest: '<%= kt.dist %>'
        }]
    },
    dev: {
        options: {
            mangle: true //混淆变量,用于查找混淆导致inject的bug问题
        },
        files: [{
            expand: true,
            cwd: '.tmp',
            src: [
                'scripts/**/*.ngAnnotate.js',
                'views/**/*.ngAnnotate.js',
                'common/**/*.ngAnnotate.js',
                'scripts/config.ngAnnotate.js',
                '!common/libs/**/*.js'
            ],
            dest: '.tmp'
        }]
    },
    hack: {
        options: {
            mangle: true,
        },
        files: {
            'dist/scripts/scripts.js': ['.tmp/concat/scripts/scripts.js']
        }
    },
    
};

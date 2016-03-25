module.exports = {
    options: {
        singleQuotes: true,
        // remove: true
    },
    dev: { // 为了测试查找uglify混淆导致的bug
        files: [{
            expand: true,
            cwd: '<%= kt.app %>',
            dest: '.tmp',
            src: ['scripts/**/*.js', 'common/**/*.js', 'views/**/*.js', '!common/libs/**/*.js'],
            ext: '.ngAnnotate.js'
        }]
    },
    dist: {
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            dest: '<%= kt.dist %>',
            src: ['scripts/**/*.js', 'common/**/*.js', 'views/**/*.js'],
            ext: '.js'
        }, {
            expand: true,
            cwd: '.tmp/concat',
            dest: '.tmp/concat',
            src: ['scripts/*.js', '!scripts/vendor.js'],
            ext: '.js'
        }]
    }
};

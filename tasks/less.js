module.exports = {
    dev: {
        options: {
            sourceMap: true,
            sourceMapRootpath: '/',
            sourceMapBasepath: '/',
            // sourceMapFilename: '.tmp/less.map',
            sourceMapFileInline: true,
            optimization: 2
        },
        files: [{
            expand: true,
            cwd: '<%= kt.app %>',
            src: ['common/directives/**/*.less', 'scripts/directives/**/*.less', 'views/**/*.less', 'less/*.less'],
            dest: '.tmp',
            ext: '.css'
        }]
    },
    production: {
        options: {
            // optimization: 2,
            compress: true
        },
        files: [{
            expand: true,
            cwd: '<%= kt.app %>',
            src: ['less/*.less'],
            dest: '.tmp',
            ext: '.css'
        }, {
            expand: true,
            cwd: '<%= kt.app %>',
            src: ['common/directives/**/*.less', 'scripts/directives/**/*.less', 'views/**/*.less'],
            dest: '<%= kt.dist %>',
            ext: '.css'
        }]

    }
};

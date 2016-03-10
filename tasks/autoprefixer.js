module.exports = {
    options: {
        browsers: ['> 2% in cn',
            'Chrome > 10',
            'Firefox > 20',
            'ie > 8',
            'Android > 2.3',
            'iOS > 5',
            'ChromeAndroid > 10'
        ]
    },
    development: {
        files: [{
            expand: true,
            cwd: '.tmp',
            src: ['styles/**/*.css', 'common/directives/**/*.css', 'scripts/directives/**/*.css'],
            dest: '.tmp',
            ext: '.css'
        }]
    },
    production: {
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: ['styles/**/*.css', 'scripts/directives/**/*.css', 'common/directives/**/*.css'],
            dest: '<%= kt.dist %>',
            ext: '.css'
        }]
    }
};

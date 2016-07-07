module.exports = {
    // html: 'app/index.html',
    options: {
        dest: 'dist',
        flow: {
            steps: {
                css: ['concat', 'cssmin'],
                js: ['concat', 'uglify']
            },
            post: {
                css: [{
                    name: 'cssmin',
                    createConfig: function(context, block) {
                        var generated = context.options.generated;
                        generated.options = {
                            keepSpecialComments: 0
                        }
                    }
                }],
                js: [{
                    name: 'uglify',
                    createConfig: function(context, block) {
                        var generated = context.options.generated;
                        generated.options = {
                            // compress: {
                            //     drop_console: true
                            // },
                            mangle: true
                        }
                    }
                }]
            }
        }
    },
    dist: {
        src: ['app/index.html', 'app/views/h5/**/*.html']
    }
};

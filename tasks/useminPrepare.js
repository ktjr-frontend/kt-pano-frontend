module.exports = {
    html: 'app/index.html',
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
                        };
                    }
                }]
            }
        }
    }
};

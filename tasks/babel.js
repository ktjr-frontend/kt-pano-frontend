module.exports = {
    options: {},
    dist: {
        files: [{
            expand: true,
            cwd: '<%= kt.app %>',
            dest: '<%= kt.app %>',
            src: ['scripts/**/*.es6', 'common/**/*.es6', 'views/**/*.es6'],
            ext: '.js'
        }]
    }
};

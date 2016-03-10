module.exports = {
    dist: {
        options: {
            optimizationLevel: 3
        },
        files: [{
            expand: true,
            cwd: '<%= kt.dist %>',
            src: ['images/**/*.{png,jpg,gif}'],
            dest: '<%= kt.dist %>'
        }]
    }
};

module.exports = {
    options: {
        plugins: [{
            removeViewBox: false
        }, {
            removeUselessStrokeAndFill: false
        }, {
            convertTransform: false
        }, {
            convertPathData: false
        }, {
            removeUnknownsAndDefaults: false
        }]
    },
    app: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= kt.app %>',
            src: ['images/**/*.svg'],
            dest: '<%= kt.app %>'
        }]
    }
};

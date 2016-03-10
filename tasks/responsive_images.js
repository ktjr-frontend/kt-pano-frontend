module.exports = {
    myTask: {
        options: {
            sizes: [{
                width: '50%',
                suffix: '',
                quality: 100
            }]
        },
        files: [{
            expand: true,
            src: ['**.{jpg,gif,png}', '!**-50pc.{png,gif,jpg}'],
            cwd: 'app/images/slice/',
            dest: 'app/images/slice/'
        }]
    }
};

module.exports = {
    dist: {
        files: [{
            dot: true,
            src: ['<%= kt.dist %>/{,*/}*', '!<%= kt.dist %>/.git*']
        }]
    },
    dev: '.tmp'
};

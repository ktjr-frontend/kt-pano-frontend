module.exports = {
    mina: {
        cmd: function(env) {
            return 'mina deploy stage=' + (env || 'development');
        }
    },
    unlock: {
        cmd: function(env) {
            return 'mina deploy:force_unlock stage=' + (env || 'development')
        }
    }
};

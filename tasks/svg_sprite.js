module.exports = {
    basic: {
        expand: true,
        cwd: '<%= kt.app %>/svgs',
        src: ['symbol/*.svg'],
        dest: '<%= kt.app %>/images',
        options: {
            mode: {
                inline: true,
                symbol: {
                    sprite: './sprite.basic.svg'
                }
            }
        }
    }
};

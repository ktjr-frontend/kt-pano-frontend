module.exports = {
    less: {
        files: [
            '<%= kt.app %>/less/**/*.less',
            '<%= kt.app %>/common/styles/**/*.less',
            '<%= kt.app %>/less/icon_img.sprite.css',
            '<%= kt.app %>/common/directives/**/*.less',
            '<%= kt.app %>/scripts/directives/**/*.less'
        ],
        tasks: ['less:development'],
    },

    // less2: {
    //     files: ['<%= kt.app %>/common/directives/**/*.less', '<%= kt.app %>/scripts/directives/**/*.less'],
    //     tasks: ['less:common'],
    // },

    imgresponsive: {
        files: [
            '<%= kt.app %>/images/slice/**.{jp?g,png,gif}',
            '!<%= kt.app %>/images/slice/**-50pc.{jp?g,png,gif}'
        ],
        tasks: ['responsive_images']
    },

    svgs: {
        files: ['<%= kt.app %>/svgs/**/*.svg', '!<%= kt.app %>/svgs/symbol/*.svg'],
        tasks: ['replace:svgfont']
    },

    svg_sprite: {
        files: ['app/svgs/symbol/*.svg'],
        tasks: ['svg_sprite']
    },

    svgmin: {
        files: ['app/images/**/*.svg'],
        tasks: ['svgmin:app']
    },

    js: {
        files: ['<%= kt.app %>/scripts/**/*.js', '<%= kt.app %>/common/**/*.js', '<%= kt.app %>/views/**/*.js'],
        options: {
            livereload: '<%= connect.options.livereload %>'
        }
    },

    babel: {
        files: ['<%= kt.app %>/scripts/**/*.es6', '<%= kt.app %>/common/**/*.es6'],
        tasks: ['babel']
    },

    injector: {
        files: ['tasks/injector.js'],
        tasks: ['injector:indexCommoncss', 'injector:indexCommonjs', 'injector:indexAppcss', 'injector:indexAppjs']
    },

    livereload: {
        options: {
            livereload: '<%= connect.options.livereload %>'
        },
        files: [
            '<%= kt.app %>/**/*.html',
            '.tmp/**/*.css',
            '<%= kt.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
    }
};

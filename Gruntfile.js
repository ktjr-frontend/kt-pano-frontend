/* jshint node:true */
'use strict';
module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Show grunt task time
    require('time-grunt')(grunt);

    // Configurable paths for the app
    var appConfig = {
        app: 'app',
        dist: 'dist'
    };

    //loads the various task configuration files
    var options = {
        lineEnding: grunt.util.linefeed,
        kt: appConfig,
        config: {
            src: 'tasks/*.js'
        }
    };

    var configs = require('load-grunt-configs')(grunt, options);
    grunt.initConfig(configs)

    //更新资源文件用到的版本号
    grunt.registerTask('updateVersion', 'update the version', function() {
        var pkg = grunt.file.readJSON('package.json');
        var newVersion = grunt.option('version-set');
        if (newVersion !== pkg.version) {
            grunt.config.merge({
                replace: {
                    version: {
                        options: {
                            patterns: [{
                                match: new RegExp('([\'\"])(' + pkg.version + ')\\1', 'g'),
                                replacement: function(match, quota, versionStr) {
                                    var versionArr = versionStr.split('.')
                                    versionArr[2] = parseInt(versionArr[2], 10) + 1
                                    return quota + (newVersion || versionArr.join('.')) + quota
                                }
                            }]
                        },
                        files: [{
                            expand: true,
                            cwd: './',
                            src: ['app/scripts/config.js', 'app/less/theme/*/variables.less', 'package.json', 'bower.json'],
                            dest: './'
                        }]
                    }
                }
            })
            grunt.task.run(['replace:version'])
        } else {
            grunt.log.writeln('also use the old version')
        }
    });

    grunt.registerTask('live', [
        'clean:dev',
        // 'responsive_images',
        'sprite',
        'less:development',
        // 'less:common',
        // 'copy:commonImgs',
        'copy:dev',
        // 'autoprefixer:development',
        // 'font-spider:app',
        // 'replace:svgfont',
        'svg_sprite',
        'svgmin',
        'babel',
        'injector:indexCommoncss',
        'injector:indexCommonjs',
        'injector:indexAppcss',
        'injector:indexAppjs',
        // 'copy:styles',
        'connect:livereload',
        'watch'
    ]);


    grunt.registerTask('server', [
        'build',
        'connect:dist:keepalive'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        // 'responsive_images',
        'sprite',
        'less:production',
        // 'font-spider:app',
        'injector:indexCommoncss',
        'injector:indexCommonjs',
        'injector:indexAppcss',
        'injector:indexAppjs',

        // 'replace:svgfont',
        'svg_sprite',
        'svgmin',
        'babel',
        'useminPrepare',
        'concat',
        'copy:dist',
        'replace:baseUrl',
        'imagemin',
        'cssmin',
        'autoprefixer:production',
        'replace:fontsUrl',
        'uglify',
        'replace:appConfig', //替换config.js 内的一些配置属性

        //注意filerev 的顺序
        'filerev:image',
        'filerev:fonts',
        'usemin:css',
        'usemin:js',
        'filerev:css',
        'filerev:js',
        'usemin:html',
        'filerev:html',
        'filerev_assets',
        'replace:assetsJson',
        'filerev:assetsRev',
        'injector:assetsMap',
        'htmlmin',
        // 'font-spider:dist',
    ]);

    grunt.registerTask('default', ['build'])
    grunt.registerTask('fsapp', ['font-spider:app'])
    grunt.registerTask('fsdist', ['font-spider:dist'])
    grunt.registerTask('svg', ['replace:svgfont', 'svgmin'])
    grunt.registerTask('uv', ['updateVersion'])
    grunt.registerTask('serve', ['connect:dist:keepalive'])
    grunt.registerTask('hint', ['jshint'])
    grunt.registerTask('lint', ['eslint'])
    grunt.registerTask('perform', ['phantomas'])
    grunt.registerTask('test', ['injector:karma', 'karma:unit'])
    grunt.registerTask('daily', ['exec:mina'])
    grunt.registerTask('publish', ['exec:mina:production'])
    grunt.registerTask('unlock', ['exec:unlock'])
};

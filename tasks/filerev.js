module.exports.tasks = {
    filerev: {
        options: {
            algorithm: 'md5',
            length: 8
        },
        // usemin: { //尽量保持在一个任务里面生成，否则在后面的usemin tasks里面替换revved 资源文件不生效
        //     src: [
        //         '<%= kt.dist %>/scripts/{,*/}*.js',
        //         '<%= kt.dist %>/styles/{,*/}*.css',
        //         // '<%= kt.dist %>/images/**/*.*',
        //         // '<%= kt.dist %>/views/**/*.html',
        //         // '<%= kt.dist %>/fonts/kt/**/*.*'
        //     ],
        //     // dest: '.tmp'
        // },
        html: {
            src: [
                '<%= kt.dist %>/views/**/*.html',
                '<%= kt.dist %>/common/directives/**/*.html',
                '<%= kt.dist %>/scripts/directives/**/*.html',
            ],
            // dist: '.tmp'
        },
        js: {
            src: [
                '<%= kt.dist %>/common/**/*.js',
                '<%= kt.dist %>/scripts/**/*.js',
                '<%= kt.dist %>/views/**/*.js'
            ],
            // dist: '.tmp'
        },
        css: {
            src: [
                '<%= kt.dist %>/styles/**/*.css',
                '<%= kt.dist %>/common/directives/**/*.css',
                '<%= kt.dist %>/scripts/directives/**/*.css'
            ],
            // dist: '.tmp'
        },
        image: {
            src: [
                '<%= kt.dist %>/images/**/*.*',
                '<%= kt.dist %>/favicon.ico',
                '<%= kt.dist %>/common/directives/**/*.{jpg,png,gif,svg,jpeg}',
                '<%= kt.dist %>/scripts/directives/**/*.{jpg,png,gif,svg,jpeg}',
            ],
            // dist: '.tmp'
        },
        fonts: {
            src: [
                '<%= kt.dist %>/fonts/lode/**/*.*'
            ],
            // dist: '.tmp'
        },
        assetsRev: {
            src: [
                '<%= kt.dist %>/scripts/assets-rev.js'
            ],
            // dist: '.tmp'
        }
        // fonts: {
        //     src: ['<%= kt.dist %>/fonts/kt/**/*.*'],
        //     dest: '<%= kt.dist %>/fonts'
        // }
    },
    filerev_assets: {
        dist: {
            options: {
                dest: 'dist/scripts/assets-rev.js',
                cwd: 'dist/', //用于替换生成的map相对路径
                // prefix: '../'
            }
        }
    },
};

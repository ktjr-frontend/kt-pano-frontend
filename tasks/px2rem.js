module.exports = {
    default: {
        options: {
            designWidth: 1242, //设计稿宽度
            baseFont: 1242 / 10, //基础字体
            border: 1, //1不处理border，0处理
            ie8: 0, //1生成ie8代码，0不生成
            dest: 'dist/views/h5/', //rem css输出目录
            mode: 0 //0:px转rem，1rem转px
        },
        files: [{
            src: ['dist/views/h5/**/*.css'] //要监听的css目录
        }]
    }
};

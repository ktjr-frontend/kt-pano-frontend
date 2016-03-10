module.exports = {
    options: {
        // jshintrc: '/Users/luxueyan/.jshintrc',
        asi: true,
        '-W030': true, //&&,|| 连接表达式
        '-W055': true, //类名非大写
        '-W032': true, //不必要分号
        // '-W069': true, //用点符号调用属性和方法不用a["b"]
        reporter: '/Users/luxueyan/work/node_modules/jshint-stylish/stylish.js',
        globals: {
            angular: true,
            '$': true
        }
    },
    scripts: ['app/scripts/**/*.js'],
    common: ['app/common/**/*.js']
};

/**
 * 全局初始化控制
 */

$(document).ready(function() {
    'use strict';

    $('html').toggleClass('ie', isIe()).toggleClass('safari', isSafari()).toggleClass('mobile', detectmob());

    //加载的时候禁止鼠标中轮滚动和移动设备上得触摸事件
    $(window).on('mousewheel touchstart', function(e) {
        e.preventDefault()
        return false;
    })

    $(window).bind('load', function() {

        setTimeout(function() {
            $(window).off('mousewheel touchstart')
                // 移除加载遮罩层
            $('.splash').css('display', 'none')
        }, 10);

        // 谷歌统计
        // (function(i, s, o, g, r, a, m) {
        //     /*jshint -W069 */
        //     i['GoogleAnalyticsObject'] = r;
        //     i[r] = i[r] || function() {
        //         (i[r].q = i[r].q || []).push(arguments)
        //     }, i[r].l = 1 * new Date();
        //     a = s.createElement(o),
        //         m = s.getElementsByTagName(o)[0];
        //     a.async = 1;
        //     a.src = g;
        //     m.parentNode.insertBefore(a, m)
        // })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        // ga('create', 'UA-66185696-2', 'auto');
        // ga('send', 'pageview');

        // // 百度统计
        // window._hmt = window._hmt || [];
        // (function() {
        //     var hm = document.createElement('script');
        //     hm.src = '//hm.baidu.com/hm.js?ff09f3032a8e3f85e8e0cc21aaa1d1ec';
        //     var s = document.getElementsByTagName('script')[0];
        //     s.parentNode.insertBefore(hm, s);
        // })();

        /*;(function() {
            var cnzz = document.createElement('script');
            cnzz.src = '//s4.cnzz.com/z_stat.php?id=1256062534&web_id=1256062534';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(cnzz, s);
        })();*/
    })


    /*jshint -W030 */
    /*eslint-disable*/
    console && console.log('%c安全警告！', 'color:red;font-size:50px;-webkit-text-stroke: 1px #333;')
    console && console.log('%c此浏览器功能专供开发者使用。请不要在此粘贴执行任何内容，这可能会导致您的账户受到攻击，给您带来损失！', 'color:#333;font-size:20px;')
        /*eslint-enable*/
});

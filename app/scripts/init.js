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

        // 百度统计
        window._hmt = window._hmt || [];
        (function() {
            var hm = document.createElement('script');
            hm.src = '//hm.baidu.com/hm.js?3ac43202abd384ca8d53e206a9d630f1';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(hm, s);
        })();

        // GrowingIO 统计
        var _vds = _vds || [];
        window._vds = _vds;
        (function() {
            _vds.push(['setAccountId', 'bf0171ce43a26b90']);
            (function() {
                var vds = document.createElement('script');
                vds.type = 'text/javascript';
                vds.async = true;
                vds.src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(vds, s);
            })();
        })();
    })


    /*jshint -W030 */
    /*eslint-disable*/
    console && console.log('%c安全警告！', 'color:red;font-size:50px;-webkit-text-stroke: 1px #333;')
    console && console.log('%c此浏览器功能专供开发者使用。请不要在此粘贴执行任何内容，这可能会导致您的账户受到攻击，给您带来损失！', 'color:#333;font-size:20px;')
        /*eslint-enable*/
});

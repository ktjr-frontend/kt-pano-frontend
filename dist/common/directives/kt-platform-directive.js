;
(function() {
    'use strict';
    angular.module('kt.common')
        .directive('ktPlatformInit', function() {
            return {
                restrict: 'A',
                link: function() {

                    window.requestAnimationFrame(function() {
                        setBodySmall();
                        fixWrapperHeight();
                    })

                    $(window).bind('resize click', function() {

                        // Add special class to minimalize page elements when screen is less than 768px
                        window.requestAnimationFrame(function() {
                            setBodySmall();
                        })

                        // Waint until metsiMenu, collapse and other effect finish and set wrapper height
                        setTimeout(function() {
                            fixWrapperHeight();
                        }, 200);
                    })

                    // 设置最小高度为窗口高度
                    function fixWrapperHeight() {
                        var winH = $(window).height()
                        if (winH < 600) winH = 600 //  避免在iphone4手机太短的问题
                        $('#wrapper').css('min-height', winH + 'px');
                    }

                    // 是否是小屏幕
                    function setBodySmall() {
                        if ($(window).width() < 769) { //严格模式禁止this指向window
                            $('body').addClass('page-small');
                        } else {
                            $('body').removeClass('page-small');
                            $('body').removeClass('show-sidebar');
                        }
                    }

                }
            }
        })
})();

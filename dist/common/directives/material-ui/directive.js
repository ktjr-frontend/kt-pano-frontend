/**
 * datepicker 指令
 * @require ['jQuery']
 */
;
(function() {
    'use strict';
    angular.module('kt.common')
        .directive('ktRippleButton', function($timeout) {
            return {
                restrict: 'A',
                // scope: true,
                link: function($scope, $elem, $attrs) {
                    if (!$('html').hasClass('mobile')) return;
                    var actionChild = $attrs.actionChild || 'a' // 鼠标响应元素选择器
                    var effectChild = $attrs.effectChild || actionChild // 波纹所在的父元素选择器 appendto
                    $elem.on('mousedown', actionChild, function(e) {
                        var effectElement = $(this).closest(effectChild)
                        effectElement = effectElement.length ? effectElement : $(this)
                        var offset = effectElement.offset()
                        var x = e.pageX
                        var y = e.pageY

                        effectElement.children('.ripple').remove()
                        effectElement.css({
                            position: 'relative',
                            overflow: 'hidden'
                        })

                        var r = Math.max(effectElement.width(), effectElement.height())
                        var ripple = $('<span class="ripple"></span>').css({
                            width: r,
                            height: r
                        })

                        ripple.appendTo(effectElement).css({
                            left: x - offset.left - ripple.width() / 2,
                            top: y - offset.top - ripple.height() / 2
                        }).addClass('ripple')
                    })
                }
            }
        })
})();

/**
 * datepicker 指令
 * @require ['jQuery', 'kt-captcha.js']
 */
;
(function() {
    'use strict';
    angular.module('kt.common')
        .directive('ktCaptchaImg', function(ktCaptcha) {
            return {
                restrict: 'A',
                scope: {
                    settings : '=settings'
                },
                link: function(scope, elm, attrs) {
                    var height = attrs.height | 0;
                    var linkToH = $(attrs.heightLinkTo)
                    var cRect

                    if (linkToH.length) {
                        var cRect = linkToH[0].getBoundingClientRect()
                        height = cRect.height - 2
                    }

                    var CAPTCHA = new ktCaptcha($.extend({
                        selector: elm,
                        height: height,
                        width: attrs.width | 0,
                        font: 'bold 25px "Comic Sans MS", cursive, sans-serif',
                        onSuccess: function() {
                            scope.$emit('imgCaptchaSuccess.' + elm.attr('id'), scope.data || {})
                        },
                        onError: function() {
                            scope.$emit('imgCaptchaSuccess.' + elm.attr('id'))
                        }
                    }, scope.settings || {}))

                    CAPTCHA.generate()
                    elm.data('captcha', CAPTCHA)
                    scope.settings && (scope.settings.CAPTCHA = CAPTCHA)
                    
                    scope.$on('validateImgCaptcha.' + elm.attr('id'), function($event, data) {
                        scope.data = data
                        CAPTCHA.validate(data.value)
                    })
                }
            }
        })
})();

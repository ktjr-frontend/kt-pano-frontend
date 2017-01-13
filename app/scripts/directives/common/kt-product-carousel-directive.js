;
(function() {
    'use strict';
    angular.module('kt.pano')
        .directive('ktProductCarousel', function() {
            var mySwiper
            return {
                restrict: 'A',
                scope: {
                    similars: '='
                },
                replace: true,
                template: '<div class="swiper-container">' +
                    '<div class="swiper-wrapper">' +
                    '<div class="swiper-slide" ng-repeat="similar in similars">' +
                    '<div class="swiper-height" ng-if="!similar.empty">' +
                    '<div class="first-data" ng-bind="similar.name"></div>' +
                    '<div class="two-data" ng-bind="similar.life"></div>' +
                    '<div class="three-data first-td" ng-bind="similar.rate"></div>' +
                    '<div class="four-data" ng-bind="similar.from_or_exchange"></div>' +
                    '</div>' +
                    '<div class="swiper-height swiper-hide" ng-if="similar.empty"><span class="seize"><span></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="swiper-button-prev swiper-button-black"></div>' +
                    '<div class="swiper-button-next swiper-button-black"></div>' +
                    '</div>',
                link: function(scope) {
                    /*eslint-disable*/

                    scope.$watch('similars', function() {
                        mySwiper && mySwiper.destroy()
                        mySwiper = new Swiper('.swiper-container', {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            prevButton: '.swiper-button-prev',
                            nextButton: '.swiper-button-next'
                        })
                    }, true)

                    /*eslint-enable*/
                }
            }
        })
        .directive('ktSlideCode', function() {
            /**
             *滚动到屏幕高度以后显示二维码
             */
                return {
                    restrict: 'A',
                    link: function(scope, element) {
                        var newheight = $('.buttons').offset().top + $('.buttons').height()
                        $(window).on('scroll', function() {
                            if ($(document).scrollTop() > newheight) {
                                element.css('display', 'block')
                            } else {
                                element.css('display', 'none')
                            }
                        })
                    }
                }
        })
})();

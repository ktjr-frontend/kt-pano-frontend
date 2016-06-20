/**
 * @author luxueyan
 */
;
(function() {
    'use strict';

    function localeDate() {
        return moment.localeData().meridiem(moment().hour(), moment().minute())
    }

    var config = {
        nowLocate: localeDate(),
        logoHorizonal: 'images/logo.svg',
        logoHorizonal2: 'images/logo2.svg',
        chartColors: [
            '#6691d8', '#5cbae1', '#68d5b2', '#a3e395', '#e5eea0', '#eace81', '#f4b673', '#f4956f', '#e97384', '#e95b6f', '#af75e5', '#8966e3', '#686fdf',
            '#7599da', '#75c5da', '#e1b764', '#da7575', '#da7591', '#e1b764', '#c4da75', '#c4da75', '#ba75da', '#a275da',
        ],
        /*chartColors: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
            '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
            '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'
        ]*/

    }

    angular.module('kt.pano')
        .factory('ktHomeResource', function($rootScope, $timeout) {
            return {
                get: function() {
                    return config
                },
                init: function() {
                    $.extend($rootScope, config)

                    // 页面激活时更新时间
                    if (_.isUndefined(DocumentVisible.hidden)) {
                        $(window).on('focus', function() {
                            $rootScope.nowLocate = localeDate()
                        })
                    } else {
                        var tp = null
                        DocumentVisible.addEvent(function() {
                            $timeout.cancel(tp)
                            tp = $timeout(function() {
                                    if (!DocumentVisible.hidden) {
                                        $rootScope.nowLocate = localeDate()
                                    }
                                }, 500) // timeout for chrome twice fire visibilityChange bug
                        })
                    }
                }
            }
        })

})();

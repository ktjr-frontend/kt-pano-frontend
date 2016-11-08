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
        /*chartColors: [
            '#7599da', '#75a5da', '#75b0da', '#75bbda', '#75c5da', '#75d1da',
            '#75dad8', '#75dace', '#75dac4', '#75daba', '#75dab0', '#75daa6',
            '#75da9c', '#75da92', '#75da89', '#75da7f', '#75da75', '#7dda75',
            '#86da75', '#8fda75', '#98da75', '#a1da75', '#a9da75', '#b2da75',
            '#bbda75', '#c4da75', '#ccda75', '#d4da75', '#dad775', '#dacf75',
            '#dac775', '#e2c062', '#e1b764', '#e1af6b', '#dba56d', '#e09e6d',
            '#da9168', '#e47c7c', '#ee7f7f', '#f48484', '#fa8888', '#f08198',
            '#e0779c', '#da7591', '#da759e', '#da75ab', '#da75b8', '#da75c6',
            '#da75d3', '#d475da', '#c775da', '#ba75da', '#ae75da', '#a275da',
            '#9675da', '#8a75da', '#7e75da', '#7577da', '#7584da', '#758eda'
        ]*/

        chartColors: [

            '#6691d8', '#5cbae1', '#68d5b2', '#a3e395', '#e5eea0', '#eace81', '#f4b673', '#f4956f', '#e97384', '#e95b6f', '#af75e5', '#8966e3', '#686fdf',
            '#7599da', '#75c5da', '#e1b764', '#da7575', '#da7591', '#e1b764', '#c4da75', '#c4da75', '#ba75da', '#a275da',
        ]
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

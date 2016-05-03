/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    .factory('ktHomeResource', function(ktS, $timeout) {
        function localeDate() {
            return moment.localeData().meridiem(moment().hour(), moment().minute())
        }

        var config = {
            nowLocate: localeDate(),
            logoHorizonal: ktS('images/logo.svg'),
            logoHorizonal2: ktS('images/logo2.svg'),
            chartColors: ['#6596e0', '#7fd7be', '#6adff0', '#f07a6a', '#8ab759',
                '#89c8d0', '#ffa500', '#40e0d0',
                '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0', '#47558f', '#9a6af0', '#b7a0c4',
            ],
            /*chartColors: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'
            ]*/

        }

        // 页面激活时更新时间
        $(window).on('focus', function() {
            config.nowLocate = localeDate()
        })

        var tp = null
        DocumentVisible.addEvent(function() {
            $timeout.cancel(tp)
            tp = $timeout(function() {
                if (!DocumentVisible.hidden) {
                    config.nowLocate = localeDate()
                }
            }, 500) // timeout for chrome twice fire visibilityChange bug
        })

        return {
            get: function() {
                return config
            }
        }
    })

})();

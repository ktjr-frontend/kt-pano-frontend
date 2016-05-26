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
            // '#5a84ce', '#74b9d6', '#77bfa7', '#8ea5e9', '#777edc', '#be9ce9', '#5caaaa', '#ebba54', '#e57462', '#a4c98a', '#5477b7',
            // '#5a84ce', '#74b9d6', '#77bfa7', '#8ea5e9', '#777edc', '#be9ce9', '#5caaaa', '#ebba54', '#a4c98a', '#e57462', '#5477b7',
            // '#5a84ce', '#74b9d6', '#68d4b2', '#a5e69c', '#e6f3a4', '#5caaaa', '#9ac2ed', '#be9ce9', '#ebba54', '#e57462', '#5477b7',
            // '#6596e0', '#76ceea', '#7fd7be', '#90a0ef', '#758bf5', '#c699ef', '#ec9a57', '#5cabab', '#e57462', '#e68564', '#eacc98',
            // '#6596e0', '#76ceea', '#7fd7be', '#90a0ef', '#758bf5', '#c699ef', '#ec9a57', '#f4b93a', '#efcc90', '#f56e5b', '#f57f5b',
            // '#5389dc', '#5ac2e3', '#60c69b', '#90a0ef', '#758bf5', '#46a6d7', '#3eadab', '#f4b93a', '#75b7f5', '#f56e5b', '#4d79c3',
            // '#5e8bd0', '#65bbd7', '#68bd99', '#98a5e7', '#8092ea', '#52a2cb', '#47a3a1', '#e4b249', '#80b6ea', '#e87768', '#577bb9',
            // '#2b6c99', '#6794a7', '#45a7dc', '#50bff8', '#4a819c', '#468bd7', '#3eadab', '#f4b93a', '#75b7f5', '#f56e5b', '#4d79c3',
            // '#6596e0', '#76ceea', '#7fd7be', '#90a0ef', '#758bf5', '#c699ef', '#ec9a57', '#f4b93a', '#efcc90', '#f56e5b', '#f57f5b',
            // '#5389dc', '#5ac2e3', '#60c69b', '#75b7f5', '#f56e5b', '#3eadab', '#f4b93a', '#46a6d7', '#90a0ef', '#758bf5', '#4d79c3',
            // '#5389dc', '#5ac2e3', '#60c69b', '#75b7f5', '#f56e5b', '#3eadab', '#46a6d7', '#f4b93a', '#90a0ef', '#758bf5', '#4d79c3',
            // '#5389dc', '#5ac2e3', '#60c69b', '#75b7f5', '#f56e5b', '#3eadab', '#f4b93a', '#46a6d7', '#90a0ef', '#758bf5', '#4d79c3',
            // '#5389dc', '#5ac2e3', '#60c69b', '#75b7f5',
            // '#758bf5', '#3eadab', '#f4b93a', '#46a6d7',
            // '#90a0ef', '#f56e5b', '#4d79c3',
            // '#5389dc', '#5ac2e3', '#60c69b', '#90a0ef',
            // '#758bf5', '#46a6d7', '#3eadab', '#f4b93a',
            // '#75b7f5', '#f56e5b', '#4d79c3',
            // '#6596e0', '#76ceea', '#7fd7be',
            // '#90a0ef', '#758bf5', '#c699ef',
            // '#ec9a57', '#f4b93a', '#efcc90',
            // '#f56e5b', '#f57f5b',

            // '#6596e0', '#82d2ec', '#7fd7be', '#f07a6a',
            // '#627798', '#65bfb7', '#8992a0', '#ffae00',
            // '#1e90ff', '#43afd0', '#899cff',
            // '#6596e0', '#7fd7be', '#6adff0', '#f07a6a',
            // '#8ab759', '#788da9', '#ffa500', '#dde951',
            // '#1e90ff', '#ff6347', '#ff5336', '#40e0d0',

            // '#429ce4', '#bed745', '#53ddbc', '#fc795f',
            // '#008fff', '#ff9d00', '#6fcad1', '#ce57f6',
            // '#ff7bb2', '#00e4d7', '#ff5336', '#40e0d0',

            // '#c3d463', '#7fd7be', '#bd68ee', '#f786b2',
            // '#6596e0', '#7fd7be', '#6adff0', '#f07a6a',
            // '#8ab759', '#89c8d0', '#ffa500', '#40e0d0',
            '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a',
            '#ffd700', '#6699FF', '#ff6666', '#3cb371',
            '#b8860b', '#30e0e0', '#47558f', '#9a6af0',
            '#b7a0c4',
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

/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')

    .factory('ktHomeResource', function(ktS) {
        return {
            get: function() {
                var config = {
                    // currentUrl: '/anlytics/dashboard',
                    logoHorizonal: ktS('images/logo.svg'),
                    // accountLogo: ktS('images/logo.svg'),
                    // accountLink: 'http://www.sinoguarantee.com/',
                    chartColors: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                        '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                        '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                        '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'
                    ]
                }
                return config
            }
        }
    })

})();

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
                    nowLocate: moment.localeData().meridiem(moment().hour(), moment().minute()),
                    // currentUrl: '/anlytics/dashboard',
                    logoHorizonal: ktS('images/logo.svg'),
                    // accountLogo: ktS('images/logo.svg'),
                    // accountLink: 'http://www.sinoguarantee.com/',
                    chartColors: ['#6596e0', '#7fd7be', '#47558f', '#9a6af0', '#6adff0', '#f07a6a', '#8ab759',
                        '#89c8d0', '#b7a0c4', '#89d0b8', '#ffa500', '#40e0d0',
                        '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                        '#6699FF', '#ff6666', '#3cb371', '#b8860b', '#30e0e0'
                    ]
                }
                return config
            }
        }
    })

})();

/**
 * assets filters
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')
        .filter('i18', ['ktFameLocaleTexts', function(ktFameLocaleTexts) {
            return function(val, name, name2) {
                if (!name) return ktFameLocaleTexts[val] || val;
                if (!name2) return (ktFameLocaleTexts[name] ? ktFameLocaleTexts[name][val] : val) || val;
                return (ktFameLocaleTexts[name][name2] ? ktFameLocaleTexts[name][name2][val] : val) || val;
            }
        }])
})();

/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular
        .module('kt.common')
        .directive('ktSafariImageMaxHeight', function() {
            return {
                restrict: 'A',
                link: function($scope, $element) {
                    var isSafari = /constructor/i.test(window.HTMLElement);
                    if (isSafari) {
                        $element.css({
                            'max-height': '100%'
                        })
                    }
                }
            }

        })

})();

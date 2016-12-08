/**
 * require 'jQuery', 'html2canvas'
 */
;
(function() {
    'use strict'
    angular.module('kt.common')
        .directive('ktFeedback', function() {
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                scope: {
                    options: '='
                },
                //templateUrl: function(element, attributes) {
                //return attributes.template || "angularsendfeedback.html";
                //},
                link: function($scope, $element, $attrs) {
                    $.feedback($scope.options);

                    $scope.$watch('options', function(newValue, oldValue, scope) {
                        $.feedback.destroy()
                        $.feedback(newValue)
                    })
                }
            }
        })
        .directive('ktFeedbackDestroy', function() {
            return {
                restrict: 'AE',
                link: function() {
                    $.feedback.destroy()
                    // $(document).off('click', '.feedback-btn')
                    // $('.feedback-btn').remove()
                }
            }
        })
})();

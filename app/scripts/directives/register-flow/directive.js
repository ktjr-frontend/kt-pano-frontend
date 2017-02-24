;
(function() {
    'use strict';
    angular.module('kt.pano')

    .directive('ktRegisterFlow', function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                step: '@'
            },
            templateUrl: 'scripts/directives/register-flow/template.html'
        }
    })
})();

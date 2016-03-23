;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktHomeCtrl', function($scope, $state, $window, $rootScope, ktUserService) {
            $rootScope.goHome = function() {
                $state.go('home.index')
            }

            if ($window.localStorage.token) {
                ktUserService.get({
                    notRequired: true
                }, function(data) {
                    $rootScope.user = data.account
                })
            }

        })

})();

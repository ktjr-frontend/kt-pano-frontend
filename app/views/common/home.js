;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktHomeCtrl', function($scope, $state, $rootScope) {
            $rootScope.goHome = function() {
                $state.go('home.index')
            }

            $scope.footerContainer = true

            /*if ($window.localStorage.token) {
                ktUserService.get({
                    notRequired: true
                }, function(data) {
                    $rootScope.user = data.account
                    $state.go('pano.overview')
                })
            }*/

        })

})();

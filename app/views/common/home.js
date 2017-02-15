;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktHomeCtrl', function($scope, $state, $rootScope) {
            $rootScope.goHome = function() {
                $state.go('home.index')
                    // $rootScope.bdTrack(['LandingPage页', '点击', 'logo'])
            }

            $scope.footerGoHome = function() {
                $rootScope.bdTrack(['LandingPage页', '点击', '开通官网'])
            }

            $scope.footerContactUs = function() {
                $rootScope.bdTrack(['LandingPage页', '点击', '联系我们'])
            }

            $scope.footerContainer = true

        })
})();

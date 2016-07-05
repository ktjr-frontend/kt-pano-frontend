;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktPerfectCtrl', function($scope, $rootScope, $state, ktSession, user) {

            $rootScope.goHome = function() {
                ktSession.clear()
                $state.go('home.index')
            }

            // CacheFactory.clearAll()
            $scope.user = $rootScope.user = user

            // 提交表单
            $scope.submitForm = function() {
                // CacheFactory.clearAll()
                $state.go($rootScope.defaultRoute || 'pano.overview')
            }
        })
})();

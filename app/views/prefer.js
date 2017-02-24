;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktPreferCtrl', function($scope, $rootScope, $state, ktSession, ktSweetAlert) {

            $rootScope.goHome = function() {
                ktSession.clear()
                $state.go('home.index')
            }

            // 提交表单
            $scope.submitForm = function() {
                $state.go($rootScope.defaultRoute || 'pano.overview')
            }

            $scope.skip = function() {
                ktSweetAlert.swal({
                    title: '',
                    text: '设置了业务偏好，才可以获得更多个性化服务哦',
                    confirmButtonText: '不需要',
                    showCancelButton: true,
                    cancelButtonText: '马上设置',
                }, function(isConfirm) {
                    if (isConfirm) {
                        $state.go($rootScope.defaultRoute || 'pano.overview')
                    }
                })
            }
        })
})();

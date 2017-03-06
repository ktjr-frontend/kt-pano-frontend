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
                ktSweetAlert.swal({
                    title: '',
                    text: '恭喜您注册成功！'
                })
                $state.go($rootScope.defaultRoute || 'pano.overview')
            }

            $scope.skip = function() {
                ktSweetAlert.swal({
                    title: '',
                    text: '设置了业务偏好，才可以获得更多个性化服务哦',
                    confirmButtonText: '马上设置',
                    showCancelButton: true,
                    cancelButtonText: '不需要',
                }, function(isConfirm) {
                    if (!isConfirm) {
                        ktSweetAlert.swal({
                            title: '',
                            text: '恭喜您注册成功！'
                        })
                        $state.go($rootScope.defaultRoute || 'pano.overview')
                    }
                })
            }
        })
})();

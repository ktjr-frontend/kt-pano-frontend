;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktPreferCtrl', function($scope, $rootScope, $state, ktSession, ktSweetAlert) {

            $scope.isCertifyApplication = $state.params.certifyApplication == 1 // eslint-disable-line
            $rootScope.goHome = function() {
                ktSession.clear()
                $state.go('home.index')
            }

            // 提交表单
            $scope.submitForm = function() {
                $rootScope.bdTrack(['偏好信息页', '点击', '完成'])
                ktSweetAlert.swal({
                    title: '',
                    text: $scope.isCertifyApplication ? '成功完成认证申请，审核结果将在1个工作日内通知您' : '恭喜您注册成功！'
                })
                $state.go($rootScope.defaultRoute || 'pano.overview')
            }

            $scope.skip = function() {
                $rootScope.bdTrack(['上传名片页', '点击', '跳过'])
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
                            text: $scope.isCertifyApplication ? '成功完成认证申请，审核结果将在1个工作日内通知您' : '恭喜您注册成功！'
                        })
                        $rootScope.bdTrack(['上传名片页', '点击', '不需要'])
                        $state.go($rootScope.defaultRoute || 'pano.overview')
                    } else {
                        $rootScope.bdTrack(['上传名片页', '点击', '马上设置'])
                    }
                })
            }
        })
})();

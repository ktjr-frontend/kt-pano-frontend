;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktPerfectCtrl', function($scope, $rootScope, $state, ktSession, ktSweetAlert) {

            $rootScope.goHome = function() {
                ktSession.clear()
                $state.go('home.index')
            }

            $scope.isCertifyApplication = $state.params.certifyApplication == 1 // eslint-disable-line

            // CacheFactory.clearAll()
            $scope.user = $rootScope.user

            // 提交表单
            $scope.submitForm = function() {
                // CacheFactory.clearAll()
                $rootScope.bdTrack(['上传名片页', '点击', '下一步'])
                $state.go('account.prefer', { certifyApplication: $state.params.certifyApplication })
            }

            $scope.skip = function() {
                $rootScope.bdTrack(['上传名片页', '点击', '跳过'])
                ktSweetAlert.swal({
                    title: '',
                    text: '上传名片才能完成认证哦',
                    confirmButtonText: '马上去传',
                    showCancelButton: true,
                    cancelButtonText: '残忍拒绝',
                }, function(isConfirm) {
                    if (!isConfirm) {
                        $rootScope.user.card_url = null
                        $rootScope.bdTrack(['上传名片页', '点击', '残忍拒绝'])
                        $state.go('account.prefer', { certifyApplication: $state.params.certifyApplication })
                    } else {
                        $rootScope.bdTrack(['上传名片页', '点击', '马上去传'])
                    }
                })
            }
        })
})();

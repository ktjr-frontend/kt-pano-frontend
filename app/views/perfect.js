;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktPerfectCtrl', function($scope, $rootScope, $state, ktSession, ktSweetAlert, getUser) {

            $rootScope.goHome = function() {
                ktSession.clear()
                $state.go('home.index')
            }

            // CacheFactory.clearAll()
            $scope.user = $rootScope.user = getUser

            // 提交表单
            $scope.submitForm = function() {
                // CacheFactory.clearAll()
                $state.go('account.prefer')
            }

            $scope.skip = function() {
                ktSweetAlert.swal({
                    title: '',
                    text: '上传名片才能完成认证哦',
                    confirmButtonText: '马上去传',
                    showCancelButton: true,
                    cancelButtonText: '残忍拒绝',
                }, function(isConfirm) {
                    if (!isConfirm) {
                        $rootScope.user.card_url = null
                        debugger
                        $state.go('account.prefer', { certifyApplication: $state.params.certifyApplication })
                    }
                })
            }
        })
})();

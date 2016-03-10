;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktPerfectCtrl', function($scope, $rootScope, $stateParams, $timeout, $state, CacheFactory, ktRegisterService, ktSweetAlert, ktCaptchaService, ktCaptchaHelper) {
            $scope.user = {}
            $scope.user.likes = []
            $scope.likes = [{
                name: '票 据',
                value: 0
            },{
                name: '房地产债权',
                value: 1
            },{
                name: '政府平台债权',
                value: 2
            },{
                name: '上市公司债权',
                value: 3
            },{
                name: '信 托',
                value: 4
            },{
                name: '银行理财',
                value: 5
            },{
                name: '券商资管',
                value: 6
            },{
                name: '保险资管',
                value: 7
            },{
                name: '应收账款',
                value: 8
            },{
                name: '小微贷',
                value: 9
            },{
                name: '其 他',
                value: 10
            }]

            $scope.hasLikes = ''
            $scope.$watch('user.likes.length', function(newValue, oldValue, scope) {
                if (newValue !== oldValue) {
                    $scope.hasLikes = $scope.user.likes.length ? true : ''
                }
            }); 

            $scope.submitForm = function() {
                $scope.pendingRequests = true
                ktRegisterService.update($scope.user, function(res) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '提交成功！',
                        text: '',
                        type: 'success',
                    }, function() {
                        CacheFactory.clearAll()
                        $state.go($rootScope.defaultRoute || 'pano.overview')
                    });
                }, function(res) {
                    $scope.pendingRequests = false
                    ktSweetAlert.swal({
                        title: '提交失败',
                        text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，您的信息没有提交成功，请再次尝试！'),
                        type: 'error',
                    });
                })
                return false;
            }

        })
})();

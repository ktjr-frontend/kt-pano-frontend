;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktPerfectCtrl', function($scope, $rootScope, $state, CacheFactory, ktRegisterService, ktSweetAlert, ktSession, ktBusinessCardUpload, user) {

            $rootScope.goHome = function() {
                ktSession.clear()
                $state.go('home.index')
            }
            $rootScope.user = user

            $scope.user = {}
                // $scope.user.business_card = '/images/logo-new.svg'
            $scope.upload = function(file) {
                if (!file) return
                $scope.pendingUpload = true

                ktBusinessCardUpload({
                    file: file[0],
                }).then(function(res) {
                    $scope.pendingUpload = false
                    $scope.user.business_card = res.url
                }, function(res) {
                    ktSweetAlert.swal({
                        title: '失败',
                        text: res.error || '抱歉，服务器繁忙！',
                        type: 'error',
                    })
                    $scope.pendingUpload = false
                })

            }

            // 二维码
            $scope.qrcode = {}
            $scope.qrcode.settings = {
                text: location.origin + '/views/h5/ubc.html?_t=' + $rootScope.user.id,
                width: 340,
                height: 340,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            }

            // 提交表单
            $scope.submitForm = function() {
                $scope.pendingRequests = true
                ktRegisterService.update($scope.user, function() {
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

            /*$scope.user.likes = []
            $scope.likes = [{
                name: '票 据',
                value: 0
            }, {
                name: '房地产债权',
                value: 1
            }, {
                name: '政府平台债权',
                value: 2
            }, {
                name: '上市公司债权',
                value: 3
            }, {
                name: '信 托',
                value: 4
            }, {
                name: '银行理财',
                value: 5
            }, {
                name: '券商资管',
                value: 6
            }, {
                name: '保险资管',
                value: 7
            }, {
                name: '应收账款',
                value: 8
            }, {
                name: '小微贷',
                value: 9
            }, {
                name: '其 他',
                value: 10
            }]

            $scope.hasLikes = ''
            $scope.$watch('user.likes.length', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.hasLikes = $scope.user.likes.length ? true : ''
                }
            });*/

        })
})();

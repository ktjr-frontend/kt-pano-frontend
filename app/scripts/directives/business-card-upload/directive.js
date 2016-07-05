/**
 * @dependences [ktBusinessCardUpload]
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')
        .directive('ktBusinessCard', function($rootScope, $timeout, ktBusinessCardUpload, ktCardsService, ktSweetAlert) {
            return {
                restrict: 'AE',
                scope: {
                    ktSubmit: '&',
                    close: '&dialogClose',
                    uploadType: '@',
                    user: '=ktUser'
                },
                templateUrl: 'scripts/directives/business-card-upload/template.html',
                link: function($scope) {

                    var ktSubmit = $scope.ktSubmit
                    var close = $scope.close
                    $scope.upload = function(file) {
                        if (!file) return
                        $scope.pendingUpload = true

                        ktBusinessCardUpload({
                            file: file[0],
                            token: $scope.user.id
                        }).then(function(res) {
                            $scope.pendingUpload = false
                            $scope.user.card_url = res.data.user.card_url
                        }, function(res) {
                            ktSweetAlert.swal({
                                title: '失败',
                                text: res.error || '抱歉，服务器繁忙！',
                                type: 'error',
                            })
                            $scope.pendingUpload = false
                        })
                    }

                    // 重新上传
                    $scope.deleteCardUrl = function() {
                        $scope.user.card_url = null
                        ktCardsService.delete()
                    }

                    // 轮询获取用户名片
                    var getUserCardPromise
                    var dialogClosed = false

                    function getUserCard() {
                        getUserCardPromise = $timeout(function() {
                            ktCardsService.get(function(data) {
                                if (data.user && data.user.card_url) {
                                    $scope.user.card_url = data.user.card_url
                                }
                                if (!dialogClosed) {
                                    getUserCard()
                                }
                            })
                        }, 3500)
                    }
                    getUserCard()

                    // 二维码
                    $scope.qrcode = {}
                    $scope.qrcode.settings = {
                        text: location.origin + '/views/h5/ubc.html?_t=' + $scope.user.id,
                        // text: location.origin + '/views/h5/ubc.html?_t=30fe7def0f5da26975187574285259ef1b96020b',
                        width: 340,
                        height: 340,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    }

                    // 提交表单
                    $scope.submitForm = function() {
                        $scope.pendingRequests = true
                        ktCardsService.update({
                                content: 'confirm'
                            }, function(data) {
                                $scope.pendingRequests = false
                                ktSweetAlert.swal({
                                    title: '提交成功！',
                                    text: '',
                                    type: 'success',
                                }, function() {
                                    dialogClosed = true
                                    $timeout.cancel(getUserCardPromise)
                                    $.extend($scope.user, data.account)
                                    ktSubmit()
                                })
                            },
                            function(res) {
                                $scope.pendingRequests = false
                                ktSweetAlert.swal({
                                    title: '提交失败',
                                    text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，您的信息没有提交成功，请再次尝试！'),
                                    type: 'error',
                                });
                            })

                        return false;
                    }

                    // 关闭弹出窗口
                    $scope.closeDialog = function(params) {
                        $timeout.cancel(getUserCardPromise)
                        dialogClosed = true
                        close(params)
                    }

                }
            }
        })
})();

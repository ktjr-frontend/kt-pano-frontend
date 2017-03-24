/**
 * @dependences [ktBusinessCardUpload]
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')
        .directive('ktBusinessCard', function($rootScope, $timeout, $state, ktBusinessCardUpload,
            ktBusinessCardBackUpload, ktCardsService, ktBackCardsService, ktSweetAlert) {
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
                    var pageName = $state.name === 'account.perfect' ? '上传名片页' : '个人设置页'
                    var ktSubmit = $scope.ktSubmit
                    var close = $scope.close

                    // 正面上传
                    $scope.upload = function(file) {
                        if (!file || !file.length) return
                        $scope.pendingUpload = true
                        $rootScope.bdTrack([pageName, '正面', '上传名片'])
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

                    // 背面上传
                    $scope.uploadBack = function(file) {
                        if (!file || !file.length) return
                        $scope.pendingUploadBack = true
                        $rootScope.bdTrack([pageName, '背面', '上传名片'])
                        ktBusinessCardBackUpload({
                            file: file[0],
                            token: $scope.user.id
                        }).then(function(res) {
                            $scope.pendingUploadBack = false
                            $scope.user.card_back_url = res.data.user.card_back_url
                        }, function(res) {
                            ktSweetAlert.swal({
                                title: '失败',
                                text: res.error || '抱歉，服务器繁忙！',
                                type: 'error',
                            })
                            $scope.pendingUploadBack = false
                        })
                    }

                    // 重新上传正面
                    $scope.deleteCardUrl = function(event) {
                        event.stopPropagation()
                        ktCardsService.delete(function() {
                            $scope.user.card_url = null
                            $scope.cardUrlUploadShow = false
                            $scope.user.status = 'rejected'
                            $scope.user.reason = '未上传名片正面信息'
                            $scope.user.solution = '请在下方上传名片信息'
                            $rootScope.bdTrack([pageName, '正面', '重新上传'])
                        }, function() {
                            ktSweetAlert.swal({
                                title: '',
                                text: '名片删除失败！'
                            })
                        })
                    }

                    // 重新上传背面
                    $scope.deleteCardBackUrl = function(event) {
                        event.stopPropagation()
                        ktBackCardsService.delete(function() {
                            $scope.user.card_back_url = null
                            $scope.cardBackUrlUploadShow = false
                            $scope.user.status = 'pended'
                            $rootScope.bdTrack([pageName, '背面', '重新上传'])
                        }, function() {
                            ktSweetAlert.swal({
                                title: '',
                                text: '名片删除失败！'
                            })
                        })
                    }

                    // 轮询获取用户名片,包含前面和背面
                    var getUserCardPromise
                    var userCardDisabled = false

                    function getUserCard() {
                        getUserCardPromise = $timeout(function() {
                            ktCardsService.get(function(data) {
                                // 正面
                                if (data.user && data.user.card_url) {
                                    var img = new Image()
                                    img.onload = function() {
                                        $scope.user.card_url = data.user.card_url
                                        img = null
                                    }
                                    img.src = data.user.card_url
                                }
                                // 背面
                                if (data.user && data.user.card_back_url) {
                                    var imgBack = new Image()
                                    imgBack.onload = function() {
                                        $scope.user.card_back_url = data.user.card_back_url
                                        imgBack = null
                                    }
                                    imgBack.src = data.user.card_back_url
                                }
                                if (!userCardDisabled) {
                                    getUserCard()
                                }
                            })
                        }, 3500)
                    }
                    getUserCard()

                    $rootScope.$on('$stateChangeSuccess', function() {
                        $timeout.cancel(getUserCardPromise)
                        userCardDisabled = true
                    })

                    // 名片前面二维码
                    $scope.qrcode = {}
                    $scope.qrcode.settings = {
                        text: location.origin + '/views/h5/ubc.html?r=' + Math.random().toString(16).slice(2, 8) + '&t=' + $scope.user.id,
                        // text: location.origin + '/views/h5/ubc.html?_t=30fe7def0f5da26975187574285259ef1b96020b',
                        width: 340,
                        height: 340,
                        colorDark: '#000000',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    }

                    // 名片后面二维码
                    $scope.qrcodeBack = {}
                    $scope.qrcodeBack.settings = { // s = 1 后面
                        text: location.origin + '/views/h5/ubc.html?s=1&r=' + Math.random().toString(16).slice(2, 8) + '&t=' + $scope.user.id,
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
                            userCardDisabled = true
                            $timeout.cancel(getUserCardPromise)
                            $.extend($scope.user, data.account)
                            ktSubmit()
                        }, function(res) {
                            $scope.pendingRequests = false
                            ktSweetAlert.swal({
                                title: '提交失败',
                                text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，您的信息没有提交成功，请再次尝试！'),
                                type: 'error',
                            })
                        })

                        return false;
                    }

                    // 关闭弹出窗口
                    $scope.closeDialog = function(params) {
                        $timeout.cancel(getUserCardPromise)
                        userCardDisabled = true
                        close(params)
                    }
                }
            }
        })
})();

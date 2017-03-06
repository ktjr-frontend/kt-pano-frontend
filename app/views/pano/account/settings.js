;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktSettingsCtrl', function($rootScope, $timeout, $sce, $scope, $state,
            $location, $uibModal, $window, ktSweetAlert, ktAccountService, ktCardsService,
            ktUserInfoService, ktEnv, ktUpgradeMember) {

            // $scope.settingUser = $.extend(true, {}, $rootScope.user)

            /*$scope.updateName = function() {
                var updateNameModal = $uibModal.open({
                    size: 'md',
                    templateUrl: 'views/modals/update_name.html',
                    controller: 'ktUpdateNameCtrl'
                })

                updateNameModal.result.then(function(user) {
                    ktSweetAlert.success('姓名修改成功')
                    $rootScope.user.name = user.name

                })
            }*/

            /*$scope.updateEmail = function() {
                var updateEmailModal = $uibModal.open({
                    size: 'md',
                    templateUrl: 'views/modals/update_email.html',
                    controller: 'ktUpdateEmailCtrl'
                })

                updateEmailModal.result.then(function(user) {
                    ktSweetAlert.success('邮箱修改成功')
                    $rootScope.user.email = user.email
                })
            }*/

            // 设置页面涉及到用户状态，专门更新一下用户信息
            // ktUserService.get(function(res) {
            //     $rootScope.user = res.account
            // })

            // CacheFactory.clearAll()
            // var user = $rootScope.user
            $scope.alertVisible = true

            // 用户角色提示
            $scope.memberGradeTip = $sce.trustAsHtml('非认证：注册成功但未进行名片认证，只可访问总览页。<br>已认证：注册成功且已完成名片认证，可访问市场数据和部分产品信息，不可进行检索等高级操作。<br>高级用户：除了可享受开通PANO全域的数据权限及数据检索，还可享受每月1次数据定制服务等。')

            // 升级会员
            $scope.upgrade = function() {
                ktUpgradeMember()
            }

            // 根据用户角色判断是否显示
            $scope.visibleJudgement = function(permitsList, group) {
                var trafficStatus = _.includes(permitsList || [], $rootScope.user ? $rootScope.user.status : '')
                if (!group) {
                    return trafficStatus
                }
                return _.includes(group, $rootScope.user ? $rootScope.user.group : '') && trafficStatus
            }

            // 更新用户资料
            $scope.updateProfile = function() {
                var updateProfileModal = $uibModal.open({
                    size: 'md',
                    templateUrl: 'views/modals/update_profile.html',
                    controller: 'ktUpdateProfileCtrl'
                })

                updateProfileModal.result.then(function(u) {
                    ktSweetAlert.success('信息修改成功')
                    $.extend($rootScope.user, u)
                })
            }

            // 重新上传名片
            $scope.updateBusinessCard = function() {
                if ($rootScope.user.status === 'passed') {
                    ktSweetAlert.swal({
                        title: '',
                        text: '上传名片后需重新审核，审核通过后才有权查看所有页面，确定上传？',
                        type: 'warning',
                        showCancelButton: true
                    }, function(isConfirm) {
                        if (isConfirm) {
                            openDialog()
                        }
                    })
                } else if ($rootScope.user.status === 'rejected') {
                    openDialog()
                }

                function openDialog() {
                    ktCardsService.delete(function() {
                        var updateBusinessCardModal = $uibModal.open({
                            size: 'md',
                            templateUrl: 'views/modals/update_business_card.html',
                            controller: 'ktUpdateBusinessCardCtrl'
                        })

                        updateBusinessCardModal.result.then(function(u) {
                            // ktSweetAlert.success('信息修改成功')
                            $.extend($rootScope.user, u)
                        })
                    })
                }
            }

            // 重新提交审核
            $scope.updateUserStatus = function() {
                ktSweetAlert.swal({
                    title: '您确定重新提交审核吗？',
                    text: '提交审核后，审核结果会在1个工作日内以邮件的形式通知您。',
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                }, function(isConfirm) {
                    if (isConfirm) {
                        ktCardsService.update({
                                content: 'confirm'
                            }, function() {
                                $scope.pendingRequests = false
                                $rootScope.user.status = 'pended'
                            },
                            function(res) {
                                $scope.pendingRequests = false
                                ktSweetAlert.swal({
                                    title: '提交失败',
                                    text: $.isArray(res.error) ? res.error.join('<br/>') : (res.error || '抱歉，您的信息没有提交成功，请再次尝试！'),
                                    type: 'error',
                                });
                            })
                    }
                })
            }

            $scope.updatePassword = function() {
                var updatePasswordModal = $uibModal.open({
                    size: 'md',
                    templateUrl: 'views/modals/update_password.html',
                    controller: 'ktUpdatePasswordCtrl'
                })

                updatePasswordModal.result.then(function() {
                    ktSweetAlert.success('新密码修改成功！')

                })
            }

            $scope.updateMobile = function() {
                var preMobileModal = $uibModal.open({
                    size: 'md',
                    templateUrl: 'views/modals/input_phone_captcha.html',
                    controller: 'ktPreUpdateMobileCtrl'
                })
                preMobileModal.result.then(function() {

                    var updateMobileModal = $uibModal.open({
                        size: 'md',
                        templateUrl: 'views/modals/input_phone_captcha.html',
                        controller: 'ktUpdateMobileCtrl'
                    })
                    updateMobileModal.result.then(function(user2) {
                        ktSweetAlert.success('手机修改成功！')
                        $rootScope.user.mobile = user2.mobile
                    })
                })
            }

            var infoData
                // 获取用户信息
            ktUserInfoService.get(function(data) {
                infoData = data
                $rootScope.user.asset_types = _.map(data.asset_types.selected, 'name').join('，')
                $rootScope.user.business_types = _.map(data.business_types.selected, 'name').join('，')
            })

            // 邀请链接
            $scope.inviteUrl = ktEnv().host + '/account/register?_u=' + $rootScope.user.id
            $scope.autoCopyDisabled = $window.isSafari() || $window.isSogou()

            $scope.copyTooltip = '按' + ($window.isWindows() ? 'Ctrl' : '⌘') + '-C复制!'
            $scope.copySuccess = function() {
                $scope.tooltipIsOpen = true
                $timeout(function() {
                    $scope.tooltipIsOpen = false
                }, 1000)
            }

            // 发送验证码
            $scope.sendInviteCode = function() {
                ktAccountService.get({
                    content: 'inviter_code'
                }, function() {
                    ktSweetAlert.success('发送成功，请注意查看您的手机。')
                }, function(res) {
                    ktSweetAlert.error(res.error || '抱歉，系统繁忙。')
                })
            }

            // 编辑业务偏好
            $scope.updateAssetTypes = function() {
                var updateAssetTypesModal = $uibModal.open({
                    size: 'md',
                    templateUrl: 'views/modals/prefer.html',
                    controller: function($scope, $uibModalInstance) { // eslint-disable-line
                        $scope.userInfo = infoData

                        // 提交表单
                        $scope.submitForm = function(data) {
                            $rootScope.user.asset_types = _.chain($scope.userInfo.asset_types.all).filter(function(v) {
                                return _.includes(data.asset_types, v.id)
                            }).map('name').join('，').value()
                            $rootScope.user.business_types = _.chain($scope.userInfo.business_types.all).filter(function(v) {
                                return _.includes(data.business_types, v.id)
                            }).map('name').join('，').value()
                            $uibModalInstance.close()
                        }

                        $scope.close = function($event) {
                            $event.preventDefault()
                            $uibModalInstance.dismiss('cancel')
                        }
                    }
                })

                updateAssetTypesModal.result.then(function() {
                    ktSweetAlert.success('业务偏好修改成功！')
                })
            }
        })
        /*.controller('ktUpdateNameCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService) {
            $scope.title = '修改姓名'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user.content = 'name'

            $scope.submitForm = function() {
                ktAccountService.update($scope.user, function() {
                    $uibModalInstance.close($scope.user)
                    CacheFactory.clearAll()
                }, function(res) {
                    $scope.error = res.error || '更新出错！'
                })
            }

            $scope.cancel = function($event) {
                $event.preventDefault()
                $uibModalInstance.dismiss('cancel');
            }
        })

        .controller('ktUpdateEmailCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService) {
            $scope.title = '修改邮箱'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user.content = 'email'

            $scope.submitForm = function() {
                ktAccountService.update($scope.user, function() {
                    $uibModalInstance.close($scope.user)
                    CacheFactory.clearAll()
                }, function(res) {
                    $scope.error = res.error || '更新出错！'
                })
            }

            $scope.cancel = function($event) {
                $event.preventDefault()
                $uibModalInstance.dismiss('cancel');
            }
        })
        */
        // 更新信息
        .controller('ktUpdateProfileCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService) {
            $scope.title = '修改用户信息'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user.content = 'update'

            $scope.submitForm = function() {
                ktAccountService.update($scope.user, function() {
                    $uibModalInstance.close($scope.user)
                        // CacheFactory.clearAll()
                }, function(res) {
                    $scope.error = res.error || '更新出错！'
                })
            }

            $scope.cancel = function($event) {
                $event.preventDefault()
                $uibModalInstance.dismiss('cancel')
            }
        })
        // 更新名片
        .controller('ktUpdateBusinessCardCtrl', function($rootScope, $scope, $uibModalInstance, ktSweetAlert) {
            $scope.title = '上传名片'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user.card_url = null // 默认展示二维码
            $scope.user.content = 'update_business_card'

            $scope.submitForm = function() {
                ktSweetAlert.success('信息修改成功')
                $uibModalInstance.close($scope.user)
                    // CacheFactory.clearAll()
            }

            $scope.close = function($event, isConfirm) {
                $event.preventDefault()
                if (isConfirm) {
                    ktSweetAlert.success('信息修改成功')
                    $rootScope.user.card_url = $scope.user.card_url
                    $rootScope.user.status = $scope.user.status
                }
                $uibModalInstance.dismiss('cancel')
            }
        })
        // 验证原手机号
        .controller('ktPreUpdateMobileCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService, ktGetCaptcha, ktCaptchaService, ktSweetAlert) {
            $scope.title = '原手机号验证'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user.content = 'validate_prev_captcha'
            $scope.user.captcha = ''
            $scope.hideMobileInput = true
            $scope.notLastStep = true

            $scope.imgCaptcha = {}
            $scope.refreshImgCaptcha = function() {
                ktCaptchaService.get(function(data) {
                    $scope.imgCaptcha.url = data.url
                    $scope.imgCaptcha.img_captcha_key = data.key
                })
            }

            $scope.refreshImgCaptcha()

            // 初始化图形验证码
            var getCaptcha = ktGetCaptcha.initCaptcha($scope, ktAccountService, {
                content: 'prev_captcha'
            }, $scope.user)

            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return

                if ($scope.popForm.mobile.$invalid) {
                    ktSweetAlert.error('手机号号码不正确！')
                    $scope.popForm.mobile.$setDirty()
                    return
                }

                if ($scope.popForm.img_captcha.$invalid) {
                    ktSweetAlert.error('请正确填写图形验证码！')
                    $scope.popForm.img_captcha.$setDirty()
                    return
                }

                getCaptcha({
                    mobile: $scope.user.mobile,
                    img_captcha: $scope.user.img_captcha,
                    img_captcha_key: $scope.imgCaptcha.img_captcha_key,
                    channel: channel
                })
            }

            $scope.submitForm = function() {
                ktAccountService.update($scope.user, function() {
                    $uibModalInstance.close($scope.user)
                }, function(res) {
                    $scope.error = res.error || '更新出错！'
                })
            }

            $scope.cancel = function($event) {
                $event.preventDefault()
                $uibModalInstance.dismiss('cancel')
            }
        })
        // 验证新手机号
        .controller('ktUpdateMobileCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService, ktGetCaptcha, ktCaptchaService, ktSweetAlert) {
            $scope.title = '新手机号绑定'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user = { content: 'mobile' }

            $scope.imgCaptcha = {}
            $scope.refreshImgCaptcha = function() {
                ktCaptchaService.get(function(data) {
                    $scope.imgCaptcha.url = data.url
                    $scope.imgCaptcha.img_captcha_key = data.key
                })
            }

            $scope.refreshImgCaptcha()

            // 初始化图形验证码
            var getCaptcha = ktGetCaptcha.initCaptcha($scope, ktAccountService, {
                content: 'captcha'
            }, $scope.user)

            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return

                if ($scope.popForm.mobile.$invalid) {
                    ktSweetAlert.error('手机号号码不正确！')
                    $scope.popForm.mobile.$setDirty()
                    return
                }

                if ($scope.popForm.img_captcha.$invalid) {
                    ktSweetAlert.error('请正确填写图形验证码！')
                    $scope.popForm.img_captcha.$setDirty()
                    return
                }

                getCaptcha({
                    mobile: $scope.user.mobile,
                    img_captcha: $scope.user.img_captcha,
                    img_captcha_key: $scope.imgCaptcha.img_captcha_key,
                    channel: channel
                })
            }

            $scope.submitForm = function() {

                ktAccountService.update($scope.user, function() {
                    $uibModalInstance.close($scope.user)
                    $rootScope.user.mobile = $scope.user.mobile
                        // CacheFactory.clearAll()
                }, function(res) {
                    $scope.error = res.error || '更新出错！'
                })
            }

            $scope.cancel = function($event) {
                $event.preventDefault()
                $uibModalInstance.dismiss('cancel')
            }
        })
        .controller('ktUpdatePasswordCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService) {
            $scope.title = '修改密码'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user.content = 'password'

            $scope.submitForm = function() {
                ktAccountService.update($scope.user, function() {
                    $uibModalInstance.close($scope.user)
                        // CacheFactory.clearAll()
                }, function(res) {
                    $scope.error = res.error || '更新出错！'
                })
            }

            $scope.cancel = function($event) {
                $event.preventDefault()
                $uibModalInstance.dismiss('cancel')
            }
        })
})();

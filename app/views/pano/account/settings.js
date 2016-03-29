;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktSettingsCtrl', function($rootScope, $timeout, $scope, $state, $location, $uibModal, $window, ktSweetAlert, ktAccountService) {

            // $scope.settingUser = $.extend(true, {}, $rootScope.user)

            $scope.updateName = function() {
                var updateNameModal = $uibModal.open({
                    size: 'md',
                    templateUrl: 'views/modals/update_name.html',
                    controller: 'ktUpdateNameCtrl'
                })

                updateNameModal.result.then(function(user) {
                    ktSweetAlert.success('姓名修改成功')
                    $rootScope.user.name = user.name

                })
            }

            $scope.updateEmail = function() {
                var updateEmailModal = $uibModal.open({
                    size: 'md',
                    templateUrl: 'views/modals/update_email.html',
                    controller: 'ktUpdateEmailCtrl'
                })

                updateEmailModal.result.then(function(user) {
                    ktSweetAlert.success('邮箱修改成功')
                    $rootScope.user.email = user.email
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

            $scope.isSafari = $window.isSafari()
            $scope.copyTooltip = '按' + ($window.isWindows() ? 'Ctrl' : '⌘') + '-C复制!'
            $scope.copySuccess = function() {
                $scope.tooltipIsOpen = true
                $timeout(function() {
                    $scope.tooltipIsOpen = false
                }, 1000)
            }

            $scope.sendInviteCode = function() {
                ktAccountService.get({
                    content: 'inviter_code'
                }, function() {
                    ktSweetAlert.success('发送成功，请注意查看您的手机。')
                }, function(res) {
                    ktSweetAlert.error(res.error || '抱歉，系统繁忙。')
                })
            }
        })
        .controller('ktUpdateNameCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService, CacheFactory) {
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
        // 验证原手机号
        .controller('ktPreUpdateMobileCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService, ktGetCaptcha) {
            $scope.title = '原手机号验证'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user.content = 'validate_prev_captcha'
            $scope.user.captcha = ''
            $scope.hideMobileInput = true
            $scope.notLastStep = true

            var getCaptcha = ktGetCaptcha.getCaptcha($scope, ktAccountService, {
                content: 'prev_captcha'
            }, $scope.user)

            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return
                getCaptcha($scope.user.mobile, channel)
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
                $uibModalInstance.dismiss('cancel');
            }
        })
        // 验证新手机号
        .controller('ktUpdateMobileCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService, CacheFactory, ktGetCaptcha) {
            $scope.title = '新手机号绑定'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user = { content: 'mobile' }

            var getCaptcha = ktGetCaptcha.getCaptcha($scope, ktAccountService, {
                content: 'captcha'
            }, $scope.user)

            $scope.getCaptcha = function($event, channel) {
                $event.preventDefault()
                $event.stopPropagation()

                if (channel === 'sms' && $scope.waitCaptchaMessage) return
                if (channel === 'tel' && $scope.waitCaptchaTel) return
                getCaptcha($scope.user.mobile, channel)
            }

            $scope.submitForm = function() {

                ktAccountService.update($scope.user, function() {
                    $uibModalInstance.close($scope.user)
                    $rootScope.user.mobile = $scope.user.mobile
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
        .controller('ktUpdateEmailCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService, CacheFactory) {
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
        .controller('ktUpdatePasswordCtrl', function($rootScope, $scope, $uibModalInstance, ktAccountService, CacheFactory) {
            $scope.title = '修改密码'
            $scope.user = $.extend(true, {}, $rootScope.user)
            $scope.user.content = 'password'

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
})();

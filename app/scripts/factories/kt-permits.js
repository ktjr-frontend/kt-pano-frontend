;
(function() {
    'use strict';
    angular.module('kt.pano')
        .factory('ktPermits', function($rootScope, $state, ktSweetAlert) {
            var permitChecker = {
                // 角色权限校验器
                roleCheck: function(groupPermits, isSilent) {
                    var group = $rootScope.user.group // premium: 高级用户 certified: 认证用户 normal: 非认证用户
                    var status = $rootScope.user.status
                    var trafficPermit = _.includes(groupPermits[group], status)
                    var statusAlertMap = { // 不同的状态弹出展示不同的内容
                        rejected: {
                            title: '很抱歉，您暂无权限查看该页面。',
                            html: true,
                            text: '您的认证信息审核未通过，请根据提示内容修改后重新提交审核。<br/>如有问题，可扫描下方二维码联系PANO微信小秘书：<div class="text-center mt10"><img src="/images/weixin.jpg" alt="PANO微信小秘书二维码" width="120" /></div>'
                        },
                        pended: {
                            title: '很抱歉，您暂无权限查看该页面。',
                            text: '您的信息正在审核中，审核结果会在1个工作日内以邮件或短信的形式通知您，请耐心等待。'
                        }
                    }

                    // 弹出alert提示
                    function showAlert() {
                        var alertObj = statusAlertMap[status] || {
                            title: '',
                            text: '很抱歉，您暂无权限查看该页面。<br/>如有问题，可扫描下方二维码联系PANO微信小秘书：<div class="text-center mt10"><img src="/images/weixin.jpg" alt="PANO微信小秘书二维码" width="120" /></div>',
                            html: true
                        }
                        ktSweetAlert.swal(alertObj)
                    }

                    if (!trafficPermit && !isSilent) {
                        showAlert()
                    }
                    return trafficPermit
                }
            }

            return function(toState, isSilent) { // isSilent 是否安静校验
                return _.every(toState.data.permits, function(p) {
                    return permitChecker[p.name + 'Check'](p.group, isSilent)
                })
            }
        })
        // 获取基于权限的默认页面
        .factory('ktRedirectState', function($rootScope) {
            return function() {
                var group = $rootScope.user.group // premium: 高级用户 certified: 认证用户 normal: 非认证用户
                var status = $rootScope.user.status
                var redirectStateMap = {
                    premium: { // 高级用户
                        passed: 'pano.overview',
                        pended: 'pano.overview',
                        rejected: 'pano.overview'
                    },
                    certified: { // 认证用户
                        passed: 'pano.overview',
                        pended: 'pano.overview',
                        rejected: 'pano.overview'
                    },
                    normal: { // 非认证用户
                        passed: 'pano.overview',
                        pended: 'pano.overview',
                        rejected: 'pano.overview'
                    }
                }
                return redirectStateMap[group][status] || 'account.login'
            }
        })
})();

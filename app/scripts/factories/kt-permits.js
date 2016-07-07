;
(function() {
    'use strict';
    angular.module('kt.pano')
        .factory('ktPermits', function($rootScope, $state, ktSweetAlert) {
            var permitChecker = {
                roleCheck: function(permitValues) {
                    if (!$rootScope.user || !$rootScope.user.status) return true

                    var role = $rootScope.user.status
                    var isOk = _.includes(permitValues, role)
                    if (!isOk) {
                        switch (role) {
                            case 'rejected':
                                ktSweetAlert.swal({
                                    title: '很抱歉，您暂无权限查看该页面。',
                                    // type: 'info',
                                    html: true,
                                    text: '您的认证信息审核未通过，请根据提示内容修改后重新提交审核。<br/>如有问题，可扫描下方二维码联系PANO微信小秘书：<div class="text-center mt10"><img src="/images/weixin.jpg" alt="PANO微信小秘书二维码" width="120" /></div>'
                                }, function() {
                                    if ($state.current.name !== 'pano.settings') {
                                        $state.go('pano.settings', { forceJump: true })
                                    }
                                })
                                break
                            case 'pended':
                                ktSweetAlert.swal({
                                    title: '很抱歉，您暂无权限查看该页面。',
                                    // type: 'info',
                                    // html: true,
                                    text: '您的信息正在审核中，审核结果会在1个工作日内以邮件的形式通知您，请耐心等待。'
                                }, function() {
                                    if (!_.includes(['pano.overview', 'pano.settings'], $state.current.name)) {
                                        $state.go('pano.overview', { forceJump: true })
                                    }
                                })
                                break
                            default:
                                ktSweetAlert.info('很抱歉，您暂无权限查看该页面。')
                        }
                    }
                    return isOk
                }
            }

            return function(permits) {
                return _.every(permits, function(p) {
                    return permitChecker[p.name + 'Check'](p.value)
                })
            }
        })
        .factory('ktRoleResolve', function($state) {
            return function(role) {
                var res = null
                switch (role) {
                    case 'initialized':
                        $state.go('account.perfect')
                        res = false
                        break
                    case 'rejected':
                    case 'pended':
                        $state.go('pano.settings')
                        res = false
                        break
                    default:
                        res = true
                }
                return res
            }
        })
})();

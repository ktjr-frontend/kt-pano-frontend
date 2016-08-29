;
(function() {
    'use strict';
    angular.module('kt.pano')
        .factory('ktPermits', function($rootScope, $state, ktSweetAlert) {
            var permitChecker = {
                roleCheck: function(gradePermits) {
                    if (!$rootScope.user || !$rootScope.user.status) return true

                    var grade = $rootScope.user.grade
                    var role = $rootScope.user.status
                    var permitValues = gradePermits[grade]
                    var isOk = _.includes(permitValues, role)
                    if (!isOk) {
                        switch (role) {
                            case 'rejected':
                                ktSweetAlert.swal({
                                    title: '很抱歉，您暂无权限查看该页面。',
                                    html: true,
                                    text: '您的认证信息审核未通过，请根据提示内容修改后重新提交审核。<br/>如有问题，可扫描下方二维码联系PANO微信小秘书：<div class="text-center mt10"><img src="/images/weixin.jpg" alt="PANO微信小秘书二维码" width="120" /></div>'
                                }, function() {
                                    // if (grade === '1') {
                                        if ($state.current.name !== 'pano.settings') {
                                            $state.go('pano.settings', { forceJump: true })
                                        }
                                    // } else {
                                        // $state.go('account.login', { forceJump: true })
                                    // }
                                })
                                break
                            case 'pended':
                                ktSweetAlert.swal({
                                    title: '很抱歉，您暂无权限查看该页面。',
                                    text: '您的信息正在审核中，审核结果会在1个工作日内以邮件的形式通知您，请耐心等待。'
                                }, function() {
                                    if (!_.includes(['pano.overview', 'pano.settings'], $state.current.name)) {
                                        $state.go('pano.overview', { forceJump: true })
                                    }
                                    // else {
                                    //     $state.go('pano.settings', { forceJump: true })
                                    // }
                                })
                                break
                            default:
                                ktSweetAlert.swal({
                                    title: '很抱歉，您暂无权限查看该页面。<br/>如有问题，可扫描下方二维码联系PANO微信小秘书：<div class="text-center mt10"><img src="/images/weixin.jpg" alt="PANO微信小秘书二维码" width="120" /></div>'
                                })
                        }
                    }
                    return isOk
                }
            }

            return function(permits) {
                return _.every(permits, function(p) {
                    return permitChecker[p.name + 'Check'](p.grade)
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

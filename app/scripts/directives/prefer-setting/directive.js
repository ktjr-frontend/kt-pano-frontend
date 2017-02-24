;
(function() {
    'use strict';
    angular.module('kt.pano')

    .directive('ktPreferSetting', function($uibModal, $q, ktUserInfoService, ktAssetTypeService, ktBusinessTypeService, ktSweetAlert) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ktSubmit: '&',
                close: '&dialogClose',
                uploadType: '@'
                    // userInfo: '=ktUserInfo'
            },
            templateUrl: 'scripts/directives/prefer-setting/template.html',
            link: function($scope) {
                var ktSubmit = $scope.ktSubmit
                var close = $scope.close
                $scope.user = {}
                $scope.userInfo = {}
                $scope.hasAssetType = '' // 辅助用于校验
                $scope.hasBusinessType = '' // 辅助用于校验

                // 获取用户详细信息
                ktUserInfoService.get(function(data) {
                    $.extend($scope.userInfo, data)
                    $scope.user.asset_types = _.map(data.asset_types.selected, 'id')
                    $scope.user.business_types = _.map(data.business_types.selected, 'id')
                        // 监听用于重新验证
                    $scope.$watch('user.asset_types.length', function() {
                        $scope.hasAssetType = $scope.user.asset_types.length ? $scope.user.asset_types : ''
                        $scope.preferForm.assetType.$setDirty()
                        $scope.preferForm.assetType.$validate()
                    })

                    // 监听用于重新验证
                    $scope.$watch('user.business_types.length', function() {
                        $scope.hasBusinessType = $scope.user.business_types.length ? $scope.user.business_types : ''
                        $scope.preferForm.businessType.$setDirty()
                        $scope.preferForm.businessType.$validate()
                    })
                })

                // 是否有自定义偏好资产标签
                $scope.assetTypesHasCustomTag = function() {
                    return $scope.userInfo.asset_types && _.some($scope.userInfo.asset_types.all, {
                        customized: true
                    })
                }

                // 自定义偏好资产标签
                $scope.customAssetType = function() {
                    var instModal = $uibModal.open({
                        size: 'md',
                        backdrop: 'static',
                        // animation: false,
                        templateUrl: 'scripts/directives/prefer-setting/add-tag-modal.html',
                        controller: function($scope, $uibModalInstance, ktAssetTypeService) { // eslint-disable-line
                            $scope.tag = {
                                name: ''
                            }

                            $scope.submitForm = function() {
                                $scope.pendingRequests = true
                                ktAssetTypeService.save($scope.tag, function(data) {
                                    $uibModalInstance.close(data)
                                    $scope.pendingRequests = false
                                }, function(res) {
                                    $scope.error = res.error || '保存失败！'
                                    $scope.pendingRequests = false
                                })
                            }

                            $scope.cancel = function(event) {
                                event.preventDefault()
                                $uibModalInstance.dismiss('cancel')
                            }
                        }
                    })

                    instModal.result.then(function(tag) {
                        var assetType = tag.asset_type
                        assetType.customized = true
                        $scope.userInfo.asset_types.all.push(assetType)
                    })
                }

                // 删除自定义偏好资产标签
                $scope.deleteCustomAssetType = function($event, id) {
                    $event.stopPropagation()
                    ktAssetTypeService.delete({ id: id }, function() {
                        _.remove($scope.userInfo.asset_types.all, function(v) {
                            return v.id === id
                        })

                        _.remove($scope.user.asset_types, function(v) {
                            return v === id
                        })
                    }, function(res) {
                        ktSweetAlert.error(res.error || '删除失败!')
                    })
                }

                // 是否有自定义业务偏好标签
                $scope.businessTypesHasCustomTag = function() {
                    return $scope.userInfo.business_types && _.some($scope.userInfo.business_types.all, {
                        customized: true
                    })
                }

                // 自定义业务偏好标签
                $scope.customBusinessType = function() {
                    var instModal = $uibModal.open({
                        size: 'md',
                        backdrop: 'static',
                        // animation: false,
                        templateUrl: 'scripts/directives/prefer-setting/add-tag-modal.html',
                        controller: function($scope, $uibModalInstance, ktBusinessTypeService) { // eslint-disable-line
                            $scope.tag = {
                                name: ''
                            }

                            $scope.submitForm = function() {
                                $scope.pendingRequests = true
                                ktBusinessTypeService.save($scope.tag, function(data) {
                                    $uibModalInstance.close(data)
                                    $scope.pendingRequests = false
                                }, function(res) {
                                    $scope.error = res.error || '保存失败！'
                                    $scope.pendingRequests = false
                                })
                            }

                            $scope.cancel = function(event) {
                                event.preventDefault()
                                $uibModalInstance.dismiss('cancel')
                            }
                        }
                    })

                    instModal.result.then(function(tag) {
                        var businessType = tag.business_type
                        businessType.customized = true
                        $scope.userInfo.business_types.all.push(businessType)
                    })
                }

                // 删除自定义业务偏好标签
                $scope.deleteCustomBusinessType = function($event, id) {
                    $event.stopPropagation()
                    ktBusinessTypeService.delete({ id: id }, function() {
                        _.remove($scope.userInfo.business_types.all, function(v) {
                            return v.id === id
                        })

                        _.remove($scope.user.business_types, function(v) {
                            return v === id
                        })
                    }, function(res) {
                        ktSweetAlert.error(res.error || '删除失败!')
                    })
                }

                // 提交表单
                $scope.submitForm = function() {
                    $scope.pendingRequests = true

                    var ap = ktAssetTypeService.update({}, {
                        ids: $scope.user.asset_types
                    })

                    var bp = ktBusinessTypeService.update({}, {
                        ids: $scope.user.business_types
                    })

                    $q.all(ap.$promise, bp.$promise).then(function() {
                        ktSubmit && ktSubmit({ data: $scope.user }) // eslint-disable-line
                    }).catch(function(res) {
                        ktSweetAlert.error(res.error || '保存失败！')
                    })

                    return false;

                }

                // 关闭弹出窗口
                $scope.closeDialog = function(params) {
                    close(params)
                }
            }
        }
    })

    // 辅助检查限制选择的checkbox数量
    .directive('ktChecklistLength', function() {
        return {
            require: 'ngModel',
            scope: {
                length: '=ktChecklistLength'
            },
            link: function($scope, $element, $attrs, ngModel) {
                ngModel.$validators.ktChecklistLength = function(modelValue) {
                    return _.isArray(modelValue) ? modelValue.length <= $scope.length : true
                }

                // $scope.$watch('ngModel.$viewValue.length', function() {
                //     ngModel.$validate();
                // })
            }
        }
    })
})();

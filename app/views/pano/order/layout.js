;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderLayoutCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper, ktAssetIntentionService) {

            var params = $location.search()
            $scope.shared = {}

            $scope.shared.params = $.extend({
                page: 1,
                per_page: 20,
                maxSize: 10
            }, params)

            /*
             * 这里需要定义tab的active开关，否则每次加载，会默认触发第一个tab的click事件
             */
            $scope.shared.tabActive = {
                tab0: false,
                tab1: false
            }

            $scope.tabSelect = function(state, tab) {
                if ($state.current.name === state) return

                $.extend($scope.shared.params, {
                    tab: tab,
                    page: 1,
                    per_page: 10,
                    sort_by: null,
                    order: null,
                    asset_type_eq: null,
                    guarantees_eq: null,
                    life_days_in: null
                })
                $state.go(state, $scope.shared.params)
            }

            $scope.goTo = function(key, value) {
                var p = {}
                p[key] = value
                $state.go($state.current.name, p)
            }

            $scope.pageChanged = function() {
                $location.search('page', $scope.shared.params.page)
            }

            $scope.getPublishDate = function(start, end) {
                var startDate = start ? moment(start).format('YYYY-MM-DD') : '-'
                var endDate = end ? moment(end).format('YYYY-MM-DD') : '-'
                if (start && end) {
                    return startDate + ' ~ ' + endDate
                } else if (!end && start) {
                    return startDate
                } else if (end && !start) {
                    return '至' + endDate
                }
                return '-'
            }

            $scope.getRate = function(dr, hr) {
                if (_.isNil(dr) && _.isNil(hr)) {
                    return '-'
                } else if (_.isNil(dr)) {
                    return dr.toFixed(2) + '%'
                } else if (_.isNil(hr)) {
                    return hr.toFixed(2) + '%'
                } else if (dr === hr) {
                    return dr.toFixed(2) + '%'
                }

                return dr.toFixed(2) + '%' + '-' + hr.toFixed(2) + '%'
            }

            $scope.getStatus = function(status) {
                if (status === '已发布') {
                    return '可预约'
                } else if (status === '预约结束') {
                    return '已售罄'
                }
                return status || '-'
            }

            $scope.contactMe = function(assetID) {
                ktAssetIntentionService.save({
                    asset_id: assetID
                }, function() {
                    ktSweetAlert.success('资产方已获取您的意向，稍后会与你联系。')
                })
            }

            $scope.shared.filters = []
            $scope.getConditionName = ktDataHelper.getConditionName($scope.shared.filters)
        })
})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderLayoutCtrl', function($scope, $state, $window, $location, ktSweetAlert, ktDataHelper, ktAssetIntentionService) {
            var perPageCount = ktDataHelper.getPerPage()

            var search = $location.search()
            $scope.shared = {}

            var params = $scope.shared.params = $.extend({
                page: 1,
                per_page: perPageCount,
                maxSize: $window.innerWidth > 480 ? 10 : 3
            }, search)

            /*
             * 这里需要定义tab的active开关，否则每次加载，会默认触发第一个tab的click事件
             */
            $scope.shared.tabActive = {
                tab0: false,
                tab1: false
            }

            $scope.tabSelect = function(state, tab) {
                if ($state.current.name === state) return

                $.extend(params, {
                    tab: tab,
                    page: 1,
                    per_page: perPageCount,
                    sort_by: null,
                    status_eq: null,
                    order: null,
                    asset_type_eq: null,
                    guarantees_eq: null,
                    rate_in: null,
                    life_days_in: null
                })
                $state.go(state, params)
            }

            $scope.goTo = function(key, value) {
                var p = {}
                p[key] = value
                $state.go($state.current.name, p)
            }

            $scope.$on('totalItemGot', function() { //totalItem 不满足初始page的会自动跳转到第一页
                $scope.pageChanged = function() {
                    $location.search('page', params.page)
                }
            })

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

            $scope.getLife = function (life) {
                var lifeName = (!_.isNaN(+life) && !_.isNil(life) && life !== '') ? life + '天' : (life || '-')
                return lifeName
            }

            $scope.contactMe = function(assetID) {
                ktAssetIntentionService.save({
                    asset_id: assetID
                }, function() {
                    ktSweetAlert.success('已收到您的要求，开通金融会与您联系。')
                }, function() {
                    ktSweetAlert.error('抱歉！服务器繁忙。')
                })
            }

            $scope.shared.filters = []
            $scope.shared.filtersDatas = null
            $scope.getConditionName = ktDataHelper.getConditionName($scope.shared.filters)
        })
})();

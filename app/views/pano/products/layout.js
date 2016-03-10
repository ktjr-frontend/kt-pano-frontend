;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductsLayoutCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper) {

            $scope.tabSelect = function(state) {
                $state.go(state, {
                    page: null,
                    per_page: null,
                    sort_by: null,
                    order: null,
                    asset_type_eq: null,
                    guarantees_eq: null,
                    life_days_in: null
                })
            }

            $scope.goTo = function(key, value) {
                var params = {}
                params[key] = value
                $state.go($state.current.name, params)
            }

            var params = $location.search()

            $scope.pageChanged = function() {
                $location.search('page', $scope.params.page)
            }

            $scope.contactMe = function(productID) {
                ktSweetAlert.swal({
                    title: '',
                    text: '资产方以获取您的意向，稍后会与你联系。',
                    type: 'success'
                })
            }

            $scope.shared = {}
            $scope.shared.params = $.extend({
                page: 1,
                per_page: 10,
                maxSize: 5
            }, params)
            $scope.shared.filters = [{
                name: '状态',
                type: 'list',
                value: 'status',
                options: [{
                    name: '全部',
                    active: true,
                    value: 'all'
                }, {
                    name: '在售',
                    value: 'ongoing'
                }, {
                    name: '售罄',
                    value: 'finished'
                }]
            }, {
                name: '期限',
                type: 'list',
                value: 'period',
                options: [{
                    name: '全部',
                    active: true,
                    value: 'all'
                }, {
                    name: '1~3月',
                    value: '1-3m'
                }, {
                    name: '3~6月',
                    value: '3-6m'
                }, {
                    name: '6~12月',
                    value: '6-12m'
                }, {
                    name: '1~3年',
                    value: '1-3年'
                }, {
                    name: '3年以上',
                    value: 'gt3y'
                }]
            }, {
                name: '资产类型',
                type: 'list',
                value: 'asset_type',
                options: [{
                    name: '全部',
                    active: true,
                    value: 'all'
                }, {
                    name: '政府平台',
                    value: 'government'
                }, {
                    name: '小微贷',
                    value: 'lode'
                }]
            }, {
                name: '交易所',
                type: 'dropdown',
                value: 'exchange',
                options: [{
                    name: '全部',
                    active: true,
                    value: 'all'
                }, {
                    name: '广交所',
                    value: 'gjs'
                }, {
                    name: '深交所',
                    value: 'sjs'
                }]
            }, {
                name: '平台',
                type: 'dropdown',
                value: 'fund',
                options: [{
                    name: '全部',
                    active: true,
                    value: 'all'
                }, {
                    name: '京东',
                    value: 'jd'
                }, {
                    name: '途牛',
                    value: 'tn'
                }]
            }, {
                name: '发行日期',
                type: 'list',
                value: 'published_date',
                options: [{
                    name: '全部',
                    active: true,
                    value: 'all'
                }, {
                    name: '过去1周',
                    value: 'lastWeek'
                }, {
                    name: '过去1月',
                    value: 'lastMonth'
                }, {
                    name: '过去6月',
                    value: 'last6Month'
                }, {
                    name: '过去1年',
                    value: 'last1Year'
                }]
            }]

            $scope.getConditionName = ktDataHelper.getConditionName($scope.shared.filters)
        })
})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductsLayoutCtrl', function($scope, $window, $timeout, $state, $location, ktSweetAlert, ktDataHelper) {
            var perPageCount = ktDataHelper.getPerPage()

            var search = $location.search()
            $scope.shared = {}
            $scope.shared.today_added_count = 0

            var params = $scope.shared.params = $.extend({
                page: 1,
                per_page: perPageCount
            }, search)

            $scope.shared._params = {
                totalItems: 10,
                maxSize: $window.innerWidth > 480 ? 10 : 3
            }

            /*
             * 这里需要定义tab的active开关，否则每次加载，会默认触发第一个tab的click事件
             */
            $scope.shared.tabActive = {
                tab0: false,
                tab1: false
            }

            $scope.tabSelect = function(state) {
                if ($state.current.name !== state) {
                    $state.go(state, $.extend(params, {
                        status_eq: null,
                        life_days_in: null,
                        rate_in: null,
                        asset_type_eq: null,
                        exchange_eq: null,
                        credit_manager_eq: null,
                        from_eq: null,
                        sort_by: null,
                        page: 1,
                        order: null
                    }))
                }
            }

            $scope.goTo = function(key, value) {
                var p = {}
                p[key] = value
                p.page = 1
                $state.go($state.current.name, p)
            }

            $scope.$on('totalItemGot', function(event, data) { //totalItem 不满足初始page的会自动跳转到第一页
                params.page = data.page

                $scope.pageChanged = function() {
                    $location.search('page', params.page)
                }
            })

            $scope.getStatusName = function(status) {
                if (status === '可购买') {
                    return '在售'
                }
                return status || '-'
            }

            $scope.getLife = ktDataHelper.getLife

            $scope.shared.filters = []
            $scope.shared.filterDatas = null //避免筛选时候重复请求，以及展开状态被重置

            $scope.getConditionName = ktDataHelper.getConditionName($scope.shared.filters)
        })
})();

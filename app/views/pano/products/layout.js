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
                totalPages: 1,
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
                        key_word: null,
                        rate_in: null,
                        asset_type_eq: null,
                        exchange_eq: null,
                        credit_manager_eq: null,
                        created_or_updated_in: null,
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

            // 分页的跳转
            $scope.pageGoto = function(event, key, value) {
                value = parseInt(value, 10)
                if (value < 1 || value > $scope.shared._params.totalPages) return
                if (event.keyCode !== 13) return
                var p = {}
                p[key] = value
                $state.go($state.current.name, p)
            }

            // 搜索框
            $scope.goToByEnterKey = function(event, key, value) {
                if (event.keyCode !== 13) return
                $scope.goTo(key, value)
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
/*
            // 当前页面的过滤状态
            var NORMAL_STATUS = $scope.NORMAL_STATUS = 0 // 无筛选无搜索状态
            var SEARCH_STATUS = $scope.SEARCH_STATUS = 1 // 搜索状态来
            var FILTER_STATUS = $scope.FILTER_STATUS = 2 // 筛选状态

            // 判断当前页面的筛选和搜索状态
            $scope.getFitlerStatus = function() {
                var validParams = ktDataHelper.cutDirtyParams(search)
                var validParamKeys = _.filter(_.keys(validParams), function(v) {
                    return !_.includes(['page', 'per_page', 'credit_right_or_eq', 'created_or_updated_in'], v)
                })

                if (_.includes(validParamKeys, 'key_word')) {
                    return SEARCH_STATUS
                } else if (validParamKeys.length) {
                    return FILTER_STATUS
                }
                return NORMAL_STATUS
            }*/

            $scope.getLife = ktDataHelper.getLife

            $scope.shared.filters = []
            $scope.shared.filterDatas = null //避免筛选时候重复请求，以及展开状态被重置

            $scope.getConditionName = ktDataHelper.getConditionName($scope.shared)
        })
})();

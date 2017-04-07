;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductsLayoutCtrl', function($scope, $rootScope, $window, $timeout,
            $state, $location, ktSweetAlert, ktDataHelper, ktUpgradeMember) {
            // var perPageCount = ktDataHelper.getPerPage()
            var perPageCount = 10
            var search = $location.search()
            $scope.shared = { placeholderText: '' }
            $scope.shared.today_added_count = 0
                // $scope.$on('placeholder', function(event, data) {
                //     debugger
                //     $scope.placeholderText = data.place
                // })
            var params = $scope.shared.params = $.extend({
                page: 1,
                per_page: perPageCount
            }, search)

            $scope.shared._params = {
                totalItems: 0,
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
                        'search_fields[]': null,
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
                    $rootScope.bdTrack(['产品信息页', '切换', state === 'pano.products.obligatoryRight' ? '资产类' : '资管类'])
                }
            }

            $scope.goTo = function(key, value) {
                var p = {}
                p[key] = value
                p.page = 1

                // 清除搜索结果参数
                p['search_fields[]'] = null
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
                $rootScope.bdTrack(['产品信息页', '确认', '搜索', '回车'])
                $scope.goTo(key, value)
            }

            // 升级会员
            $scope.upgrade = function() {
                if ($rootScope.user.status === 'pended') {
                    ktSweetAlert.swal({
                        title: '',
                        html: true,
                        confirmButtonText: '我知道了',
                        text: '您的帐号正在审核中，待审核通过后方可进行升级操作。<br/> 审核结果会在1个工作日内以邮件或短信的形式通知，请您耐心等待。'
                    })
                } else {
                    ktUpgradeMember()
                }
            }

            // $scope.$on('totalItemGot', function(event, data) { //totalItem 不满足初始page的会自动跳转到第一页
            //     params.page = data.page

            //     $scope.pageChanged = function() {
            //         $location.search('page', params.page)
            //     }
            // })

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

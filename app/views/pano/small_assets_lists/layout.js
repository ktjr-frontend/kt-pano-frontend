;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktAssetsTableCtrl', function($scope, $rootScope, $window, $timeout,
            $state, $location, ktSweetAlert, ktDataHelper, ktEnv) {
            var perPageCount = 10
            var search = $location.search()
            $scope.shared = { placeholderText: '' }
            $scope.shared.today_added_count = 0

            $scope.shared.params = $.extend({
                page: 1,
                per_page: perPageCount
            }, search)

            $scope.shared._params = {
                totalItems: 0,
                totalPages: 1,
                maxSize: $window.innerWidth > 480 ? 10 : 3
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

            //跳转到对接页
            $scope.goWx = function() {
                    var url = ktEnv().wxHost + '#!/project_info/add?_f=pc_xiaowei&_t=' + encodeURIComponent($window.localStorage.token)
                    $window.open(url)
            }

            // 搜索框
            $scope.goToByEnterKey = function(event, key, value) {
                if (event.keyCode !== 13) return
                $rootScope.bdTrack(['机构库', '确认', '搜索', '回车'])
                $scope.goTo(key, value)
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

            $scope.shared.filters = []
            $scope.shared.filterDatas = null //避免筛选时候重复请求，以及展开状态被重置

            $scope.getConditionName = ktDataHelper.getConditionName($scope.shared)
        })
})();

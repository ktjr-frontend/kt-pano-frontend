;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductAssetManageCtrl', function($scope, $rootScope, $state, $location, ktSweetAlert, ktDataHelper, ktProductsService) {
            var shared = $scope.shared
            var search = $location.search()
            var informationArr = ['name', 'from', 'credit_manager', 'manage_org']
            $scope.shared.placeholderText = '输入关键字，如机构名称、主要合作机构'

            // 跳转机构详情
            $scope.gotoDetail = function(inst) {
                $state.go('pano.institutions.detail', {
                    id: inst.id
                })
            }

            // 按更新时间排序标题
            $scope.updatedAtSortTitle = function() {
                if (search.sort_by === 'updated_at') {
                    if (search.order === 'asc') {
                        return '点击按更新时间由新到旧排序'
                    }
                    return '点击取消按更新时间排序'
                }
                return '点击按更新时间由旧到新排序'
            }

            // 按年华收益率排序标题
            $scope.rateSortTitle = function() {
                if (search.sort_by === 'rate') {
                    if (search.order === 'asc') {
                        return '点击按年化收益率由大到小排序'
                    }
                    return '点击取消按年化收益率排序'
                }
                return '点击按年化收益率由小到大排序'
            }

            shared.tabActive.tab1 = true
            shared._params.created_or_updated_in = _.isString(search.created_or_updated_in) ? search.created_or_updated_in.split(',') : (search.created_or_updated_in || [])
            shared._params.totalItems = 0
            $.extend(shared.params, search, { credit_right_or_eq: 'am' })
            shared._params.page = shared.params.page
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by', 'created_or_updated_in', 'search_fields[]'])
            ktDataHelper.intFitlerStatus($scope, search)

            if (!shared.filterDatas) {
                ktroductsService.get({
                    content: 'settings'
                }, function(data) {
                    shared.filterDatas = data
                    shared.filters = data['1']
                    ktDataHelper.filterInit(shared.filters, filterOpts)(shared.params)
                })
            } else {
                shared.filters = shared.filterDatas['1']
                ktDataHelper.filterInit(shared.filters, filterOpts)(shared.params)
            }

            ktProductsService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                // cacheData = res
                $scope.products = res.products
                $scope.updateTime = res.latest_uptime
                if (res.summary.find.search_results) {
                    res.summary.find.search_results = _.filter(res.summary.find.search_results, function(n) {
                        return n.search_count !== 0
                    })
                    res.summary.find.search_results.sort(function(a, b) {
                        if (_.indexOf(informationArr, a.name) > _.indexOf(informationArr, b.name)) {
                            return 1
                        } else if (_.indexOf(informationArr, a.name) < _.indexOf(informationArr, b.name)) {
                            return -1
                        }
                        return 0
                    })
                }
                $scope.summary = res.summary
                shared._params.totalItems = res.summary.find.count
                shared._params.totalPages = _.ceil(res.summary.find.count / shared.params.per_page)
                shared.params.page = search.page || shared.params.page // 修正pagination 初始化page到1导致的问题

                // $scope.$emit('totalItemGot', search)
                $scope.pageChanged = function() {
                    $location.search('page', shared.params.page)
                }

                $scope.$watch('shared._params.created_or_updated_in.length', function() {
                    if (_.isArray(shared._params.created_or_updated_in)) {
                        // shared._params.created_or_updated_in.length && $rootScope.bdTrack(['产品信息页', shared._params.created_or_updated_in.sort().join(), '看新增更新']) // eslint-disable-line
                        $state.go($state.current.name, { created_or_updated_in: shared._params.created_or_updated_in.sort().join() })
                    }
                })
            })
        })
})();

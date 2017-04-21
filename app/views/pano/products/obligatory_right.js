;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $rootScope, $state, $location, ktDataHelper, ktProductsService, ktSweetAlert) {
            var shared = $scope.shared
            var search = $scope.search = $location.search()
            var informationArr = ['name', 'from', 'exchange', 'asset_type', 'original_asset', 'type', 'trust_party']
            $scope.shared.placeholderText = '请输入产品名称、平台名称、挂牌场所、资产类型、底层资产、产品类型或增信措施'
                // $scope.$emit('placeholder', { place: '输入关键字，如产品名称、平台名称、挂牌场所、资产类型、底层资产、产品类型或增信措施' })
            // var cacheData
            var filterOpts = [{
                value: 'life_days_in',
                type: 'dropdown'
            }, {
                value: 'rate_in',
                type: 'dropdown'
            }, {
                value: 'asset_type_eq',
                type: 'dropdown'
            }]

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

            // 按募集规模排序标题
            $scope.amountSortTitle = function() {
                if (search.sort_by === 'sum_amount') {
                    if (search.order === 'asc') {
                        return '点击按募集规模由大到小排序'
                    }
                    return '点击取消按募集规模排序'
                }
                return '点击按募集规模由小到大排序'
            }

            // 跳转产品详情
            $scope.gotoDetail = function(product) {
                if (product.class === 'Product') {
                    $state.go('pano.productObligatoryRight', {
                        id: product.id
                    })
                } else {
                    ktSweetAlert.swal({
                        title: '提示',
                        timer: 1500,
                        text: '该产品暂未录入详情'
                    })
                }
            }

            shared.tabActive.tab0 = true
            shared._params.created_or_updated_in = _.isString(search.created_or_updated_in) ? search.created_or_updated_in.split(',') : (search.created_or_updated_in || [])
            shared._params.totalItems = 0

            $.extend(shared.params, search, { credit_right_or_eq: 'bond' })
            shared._params.page = shared.params.page
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by', 'created_or_updated_in', 'search_fields[]'])
            ktDataHelper.intFitlerStatus($scope, search)

            if (!shared.filterDatas) {
                ktProductsService.get({
                    content: 'settings'
                }, function(data) {
                    shared.filterDatas = data
                    shared.filters = data['0']
                    ktDataHelper.filterInit(shared.filters, filterOpts)(shared.params)
                })
            } else {
                shared.filters = shared.filterDatas['0']
                ktDataHelper.filterInit(shared.filters, filterOpts)(shared.params)
            }

            // 获取产品列表
            ktProductsService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                // cacheData = res
                $scope.updateTime = res.latest_uptime
                $scope.products = res.products
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
                        // $rootScope.bdTrack(['产品信息页', shared._params.created_or_updated_in.sort().join(), '看新增更新'])
                        $state.go($state.current.name, { created_or_updated_in: shared._params.created_or_updated_in.sort().join() })
                    }
                })
            })

            /*// 搜索结果点击
            $scope.searchTabActiveIndex = -1
            $scope.searchTabClick = function(name, index) {
                $scope.searchResultAllActive = false
                $scope.searchTabActiveIndex = index
                ktProductsService.get($.extend({ 'search_fields[]': name }, ktDataHelper.cutDirtyParams(shared.params)), function(res) {
                    $scope.products = res.products
                        // $scope.count = res.count
                    shared._params.totalItems = res.summary.find.count
                    shared._params.totalPages = _.ceil(res.summary.find.count / shared.params.per_page)
                        // $scope.$emit('totalItemGot', search)
                })
            }

            // 点击搜索结果后重置显示所有搜索结果
            $scope.searchResultAllActive = false
            $scope.showAllSearchResults = function() {
                $scope.searchResultAllActive = true
                $scope.searchTabActiveIndex = -1
                $scope.products = cacheData.products
                shared._params.totalItems = cacheData.summary.find.count
                shared._params.totalPages = _.ceil(cacheData.summary.find.count / shared.params.per_page)
            }*/
        })
})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktProductsService, ktSweetAlert) {
            var shared = $scope.shared
            var search = $scope.search = $location.search()
            var cacheData
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
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by', 'created_or_updated_in'])
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
                cacheData = res
                $scope.products = res.products

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
                        $state.go($state.current.name, { created_or_updated_in: shared._params.created_or_updated_in.sort().join() })
                    }
                })
            })

            // 搜索结果点击
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
            }
        })
})();

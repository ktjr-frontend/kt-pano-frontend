;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktProductsService) {
            var shared = $scope.shared
            var search = $location.search()
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
            $scope.gotoDetail = function(id) {
                $state.go('pano.productObligatoryRight', {
                    id: id
                })
            }

            shared.tabActive.tab0 = true
            search.created_or_updated_in = _.isString(search.created_or_updated_in) ? search.created_or_updated_in.split(',') : []
            shared._params.page = shared.params.page
            $.extend(shared.params, search, { credit_right_or_eq: 'bond' })
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by'])
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
                $scope.products = res.products

                res.count.find.search_results = [{
                    name: 'name',
                    value: '产品名称',
                    search_count: 192
                }, {
                    name: 'name',
                    value: '产品名称',
                    search_count: 120
                }, {
                    name: 'name',
                    value: '产品名称',
                    search_count: 112
                }, {
                    name: 'name',
                    value: '产品名称',
                    search_count: 12
                }, {
                    name: 'name',
                    value: '产品名称',
                    search_count: 182
                }]

                $scope.count = res.count
                shared._params.totalItems = res.products_count
                shared._params.totalPages = _.ceil(res.products_count / shared.params.per_page)
                    // shared.today_added_count = res.today_added_count
                    // shared.today_added_amount = res.today_added_amount
                $scope.$emit('totalItemGot', search)

                $scope.$watch('shared.params.created_or_updated_in.length', function() {
                    $state.go($state.current.name, { created_or_updated_in: shared.params.created_or_updated_in.join() })
                })
            })

            $scope.searchTabClick = function(name) {
                // 获取产品列表
                ktProductsService.get($.extend({ key_word_by: name }, ktDataHelper.cutDirtyParams(shared.params)), function(res) {
                    $scope.products = res.products
                        // $scope.count = res.count
                    shared._params.totalItems = res.products_count
                    shared._params.totalPages = _.ceil(res.products_count / shared.params.per_page)
                    $scope.$emit('totalItemGot', search)
                })
            }
        })
})();

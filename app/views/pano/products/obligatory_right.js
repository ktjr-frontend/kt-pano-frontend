;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktProductsService, ktSweetAlert) {
            var shared = $scope.shared
            var search = $scope.search = $location.search()
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

                $scope.summary = res.summary
                shared._params.totalItems = res.summary.find.count
                shared._params.totalPages = _.ceil(res.summary.find.count / shared.params.per_page)
                $scope.$emit('totalItemGot', search)

                $scope.$watch('shared.params.created_or_updated_in.length', function() {
                    if (_.isArray(shared.params.created_or_updated_in)) {
                        $state.go($state.current.name, { created_or_updated_in: shared.params.created_or_updated_in.join() })
                    }
                })
            })

            $scope.searchTabClick = function(name) {
                // 获取产品列表
                ktProductsService.get($.extend({ 'search_fields[]': name }, ktDataHelper.cutDirtyParams(shared.params)), function(res) {
                    $scope.products = res.products
                        // $scope.count = res.count
                    shared._params.totalItems = res.summary.find.count
                    shared._params.totalPages = _.ceil(res.summary.find.count / shared.params.per_page)
                    $scope.$emit('totalItemGot', search)
                })
            }
        })
})();

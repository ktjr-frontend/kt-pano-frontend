;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductAssetManageCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper, ktProductsService) {
            var shared = $scope.shared
            var search = $location.search()
            var filterOpts = [{
                value: 'rate_in',
                type: 'dropdown'
            }, {
                value: 'credit_manager_eq',
                type: 'dropdown'
            }]

            // 跳转产品详情
            $scope.gotoDetail = function(product) {
                if (product.class === 'Product') {
                    $state.go('pano.productAssetManage', {
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

            shared.tabActive.tab1 = true
            search.created_or_updated_in = _.isString(search.created_or_updated_in) ? search.created_or_updated_in.split(',') : (search.created_or_updated_in || [])
            shared._params.page = shared.params.page
            shared._params.totalItems = 0
            $.extend(shared.params, search, { credit_right_or_eq: 'am' })
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by'])
            ktDataHelper.intFitlerStatus($scope, search)

            if (!shared.filterDatas) {
                ktProductsService.get({
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
                $scope.products = res.products
                $scope.summary = res.summary
                shared._params.totalItems = res.summary.find.count
                shared._params.totalPages = _.ceil(res.summary.find.count / shared.params.per_page)

                // $scope.$emit('totalItemGot', search)
                $scope.pageChanged = function() {
                    $location.search('page', shared.params.page)
                }

                $scope.$watch('shared.params.created_or_updated_in.length', function() {
                    if (_.isArray(shared.params.created_or_updated_in)) {
                        $state.go($state.current.name, { created_or_updated_in: shared.params.created_or_updated_in.join() })
                    }
                })
            })

            $scope.searchTabActiveIndex = -1
            $scope.searchTabClick = function(name, index) {
                // 获取产品列表
                $scope.searchTabActiveIndex = index
                ktProductsService.get($.extend({ 'search_fields[]': name }, ktDataHelper.cutDirtyParams(shared.params)), function(res) {
                    $scope.products = res.products
                    shared._params.totalItems = res.summary.find.count
                    shared._params.totalPages = _.ceil(res.summary.find.count / shared.params.per_page)
                    $scope.$emit('totalItemGot', search)
                })
            }
        })
})();

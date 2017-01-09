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
            $scope.gotoDetail = function(id) {
                $state.go('pano.productAssetManage', {
                    id: id
                })
            }

            shared.tabActive.tab1 = true
            search.created_or_updated_in = search.created_or_updated_in ? search.created_or_updated_in.split(',') : []
            shared._params.page = shared.params.page
            $.extend(shared.params, search, { credit_right_or_eq: 'am' })
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by'])

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
                $scope.count = res.count
                shared._params.totalItems = res.products_count
                shared._params.totalPages = _.ceil(res.products_count / shared.params.per_page)
                // shared.today_added_count = res.today_added_count
                $scope.$emit('totalItemGot', search)
            })
        })
})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktCompassAssetService) {
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

            shared.tabActive.tab0 = true
            search.created_or_updated_in = search.created_or_updated_in ? search.created_or_updated_in.split(',') : []
            $.extend(shared.params, search, { credit_right_or_eq: 'bond' })
            shared._params.page = shared.params.page
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by'])

            if (!shared.filterDatas) {
                ktCompassAssetService.get({
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

            ktCompassAssetService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                $scope.products = res.compass_assets
                shared._params.totalItems = res.total_items
                shared._params.totalPages = _.ceil(res.total_items / shared.params.per_page)
                shared.today_added_count = res.today_added_count
                shared.today_added_amount = res.today_added_amount
                $scope.$emit('totalItemGot', search)

                $scope.$watch('shared.params.created_or_updated_in.length', function() {
                    $state.go($state.current.name, { created_or_updated_in: shared.params.created_or_updated_in.join() })
                })

            })
        })
})();

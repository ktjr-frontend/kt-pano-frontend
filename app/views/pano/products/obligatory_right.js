;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktCompassAssetFiltersService, ktCompassAssetService) {
            var shared = $scope.shared

            shared.tabActive.tab0 = true
            $.extend(shared.params, $location.search(), { credit_right_or_eq: 'bond' })

            // ktDataHelper.filterUpdate(shared.filters, shared.params)

            if (!shared.filterDatas) {
                ktCompassAssetFiltersService.get(function(data) {
                    shared.filterDatas = data
                    shared.filters = data['0']
                    ktDataHelper.filterInit(shared.filters)(shared.params)
                })
            } else {
                shared.filters = shared.filterDatas['0']
                ktDataHelper.filterInit(shared.filters)(shared.params)
            }

            ktCompassAssetService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                $scope.products = res.compass_assets
                shared.params.totalItems = res.total_items
                shared.today_added_count = res.today_added_count
                $scope.$emit('totalItemGot')
            })
        })
})();

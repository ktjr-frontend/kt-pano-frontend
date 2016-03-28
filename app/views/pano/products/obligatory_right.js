;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktCompassAssetFiltersService, ktCompassAssetService) {

            $scope.shared.tabActive.tab0 = true
            $.extend($scope.shared.params, $location.search(), { credit_right_or_eq: 'bond' })

            // ktDataHelper.filterUpdate($scope.shared.filters, $scope.shared.params)

            ktCompassAssetFiltersService.get(function(data) {
                $scope.shared.filters = data['0']
                var filterInit = ktDataHelper.filterInit($scope.shared.filters)
                filterInit($scope.shared.params)
            })

            ktCompassAssetService.get(ktDataHelper.cutDirtyParams($scope.shared.params), function(res) {
                $scope.products = res.compass_assets
                $scope.shared.params.totalItems = res.total_items
                $scope.shared.today_added_count = res.today_added_count
                $scope.$emit('totalItemGot')
            })
        })
})();

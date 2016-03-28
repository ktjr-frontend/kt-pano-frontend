;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductAssetManageCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper, ktCompassAssetFiltersService, ktCompassAssetService) {

            $scope.shared.tabActive.tab1 = true
            $.extend($scope.shared.params, $location.search(), { credit_right_or_eq: 'am' })

            // ktDataHelper.filterUpdate($scope.shared.filters, $scope.shared.params)
            ktCompassAssetFiltersService.get(function(data) {
                $scope.shared.filters = data['1']
                var filterInit = ktDataHelper.filterInit($scope.shared.filters)
                filterInit($scope.shared.params)
            })

            ktCompassAssetService.get(ktDataHelper.cutDirtyParams($scope.shared.params), function(res) {
                $scope.products = res.compass_assets
                $scope.shared.params.totalItems = res.total_items
                $scope.shared.today_added_count = res.today_added_count
            })
        })
})();

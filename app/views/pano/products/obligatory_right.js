;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktCompassAssetService) {

            // $scope.shared.tabActive.tab0 = true
            $.extend($scope.shared.params, $location.search(), { credit_right_or_eq: 'bond' })

            ktDataHelper.filterUpdate($scope.shared.filters, $scope.shared.params)

            ktCompassAssetService.get(ktDataHelper.cutDirtyParams($scope.shared.params), function(res) {
                $scope.products = res.compass_assets
                $scope.shared.params.totalItems = res.total_items
            })
        })
})();

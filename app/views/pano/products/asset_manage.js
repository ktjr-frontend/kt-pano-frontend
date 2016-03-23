;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductAssetManageCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper, ktCompassAssetService) {

            // $scope.shared.tabActive.tab1 = true
            $.extend($scope.shared.params, $location.search(), { credit_right_or_eq: '资管' })

            ktDataHelper.filterUpdate($scope.shared.filters, $scope.shared.params)

            ktCompassAssetService.get(ktDataHelper.cutDirtyParams($scope.shared.params), function(res) {
                $scope.products = res.compass_assets
                $scope.shared.params.totalItems = res.total_items
            })
        })
})();

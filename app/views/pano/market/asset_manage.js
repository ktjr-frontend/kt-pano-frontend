;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderAssetManageCtrl', function($scope, $state, $location, ktDataHelper, ktAssetFiltersService, ktAssetService) {
            debugger
            $scope.shared.tabActive.tab1 = true
            $.extend($scope.shared.params, $location.search(), { tab: 1 })

            ktAssetFiltersService.get(function(data) {
                $scope.shared.filters = data['1']
                var filterInit = ktDataHelper.filterInit($scope.shared.filters)
                filterInit($scope.shared.params)
            })

            ktAssetService.get(ktDataHelper.cutDirtyParams($scope.shared.params), function(res) {
                $scope.assets = res.fame_assets
                $scope.shared.params.totalItems = res.total_items
            })
        })
})();

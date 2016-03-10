;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktAssetService) {
            $scope.shared.tabActive.tab0 = true
            $.extend($scope.shared.params, $location.search(), { tab: 0 })

            ktAssetService.get({
                content: 'settings'
            }, function(data) {
                $scope.shared.filters = data["0"]
                var filterInit = ktDataHelper.filterInit($scope.shared.filters)
                filterInit($scope.shared.params)
            })

            ktAssetService.get(ktDataHelper.cutDirtyParams($scope.shared.params), function(res) {
                $scope.assets = res.fame_assets
                $scope.shared.params.totalItems = res.total_items || 1
            })
        })
})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderAssetManageCtrl', function($scope, $state, $location, ktDataHelper, ktAnalyticsService) {
            $scope.shared.tabActive.tab1 = true
            $scope.shared.filter_show = false
            $scope.assetManger = {}
            ktAnalyticsService.get({
                    content: 'rate_trend'
                }, function(data) {
                    $scope.assetManger = data.stat
                    if (data.crawled_at) {
                        $scope.updateDate = moment(data.crawled_at).format('YYYY-MM-DD')

                    }
                })
                // $.extend($scope.shared.params, $location.search(), { tab: 1 })

            // ktAssetFiltersService.get(function(data) {
            //     $scope.shared.filters = data['1']
            //     var filterInit = ktDataHelper.filterInit($scope.shared.filters)
            //     filterInit($scope.shared.params)
            // })

            // ktAssetService.get(ktDataHelper.cutDirtyParams($scope.shared.params), function(res) {
            //     $scope.assets = res.fame_assets
            //     $scope.shared.params.totalItems = res.total_items
            // })
        })
})();

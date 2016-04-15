;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderAssetManageCtrl', function($scope, $state, $location, ktDataHelper, ktAssetFiltersService, ktAssetService) {
            var shared = $scope.shared
            var search = $location.search()

            shared.tabActive.tab1 = true
            $.extend(shared.params, search, { tab: 1 })

            if (!shared.filterDatas) {
                ktAssetFiltersService.get(function(data) {
                    shared.filterDatas = data
                    shared.filters = data['1']
                    ktDataHelper.filterInit(shared.filters)(shared.params)
                })
            } else {
                shared.filters = shared.filterDatas['1']
                ktDataHelper.filterInit(shared.filters)(shared.params)
            }

            ktAssetService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                $scope.assets = res.fame_assets
                shared.params.totalItems = res.total_items
                $scope.$emit('totalItemGot', search)
            })
        })
})();

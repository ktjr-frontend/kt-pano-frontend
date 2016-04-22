;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktCompassAssetFiltersService, ktCompassAssetService) {
            var shared = $scope.shared
            var search = $location.search()

            shared.tabActive.tab0 = true
            $.extend(shared.params, search, { credit_right_or_eq: 'bond' })
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by'])

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
                shared._params.totalItems = res.total_items
                shared.today_added_count = res.today_added_count
                $scope.$emit('totalItemGot', search)
            })
        })
})();

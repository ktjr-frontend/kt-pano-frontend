;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductAssetManageCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper, ktCompassAssetService) {
            var shared = $scope.shared
            var search = $location.search()

            shared.tabActive.tab1 = true
            $.extend(shared.params, search, { credit_right_or_eq: 'am' })
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by'])

           /* if (!shared.filterDatas) {
                ktCompassAssetService.get({
                    content: 'settings'
                }, function(data) {
                    shared.filterDatas = data
                    shared.filters = data['1']
                    ktDataHelper.filterInit(shared.filters)(shared.params)
                })
            } else {
                shared.filters = shared.filterDatas['1']
                ktDataHelper.filterInit(shared.filters)(shared.params)
            }*/

            ktCompassAssetService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                $scope.products = res.compass_assets
                shared._params.totalItems = res.total_items
                shared.today_added_count = res.today_added_count
                $scope.$emit('totalItemGot', search)
            })
        })
})();

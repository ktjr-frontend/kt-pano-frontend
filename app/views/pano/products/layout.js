;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductsLayoutCtrl', function($scope, $state, $location, ktSweetAlert, ktCompassAssetFiltersService, ktDataHelper) {

            var params = $location.search()
            $scope.shared = {}

            $scope.shared.params = $.extend({
                page: 1,
                per_page: 20,
                maxSize: 10
            }, params)

            /*
             * 这里需要定义tab的active开关，否则每次加载，会默认触发第一个tab的click事件
             */
            $scope.shared.tabActive = {
                tab0: false,
                tab1: false
            }

            $scope.tabSelect = function(state) {
                if ($state.current.name !== state) {
                    $state.go(state, $scope.shared.params)
                }
            }

            $scope.goTo = function(key, value) {
                var p = {}
                p[key] = value
                $state.go($state.current.name, p)
            }

            $scope.pageChanged = function() {
                $location.search('page', $scope.shared.params.page)
            }

            $scope.shared.filters = []

            ktCompassAssetFiltersService.get(function(data) {
                $scope.shared.filters = data['0']
                var filterInit = ktDataHelper.filterInit($scope.shared.filters)
                filterInit($scope.shared.params)
            })

            $scope.getConditionName = ktDataHelper.getConditionName($scope.shared.filters)
        })
})();

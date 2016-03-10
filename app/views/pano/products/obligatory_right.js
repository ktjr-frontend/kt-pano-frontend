;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktProductObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktProductsService, ktContactUsService) {

            var filterInit = ktDataHelper.filterInit($scope.shared.filters)
            $.extend($scope.shared.params, $location.search())

            filterInit($scope.shared.params)

            ktProductsService.get($scope.shared.params, function(res) {
                $scope.products = res.products
                $scope.shared.params.totalItems = res.total_items
            })
        })
})();

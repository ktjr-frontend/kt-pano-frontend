;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktFindRecordCtrl', function($window, $timeout, $location, $scope, ktFindService) {
        var search = $location.search()
        $scope._params = {
            totalItems: 0,
            maxSize: $window.innerWidth > 480 ? 10 : 3
        }

        $scope.params = {
            page: 1,
            per_page: 10
        }

        $.extend($scope.params, $location.search())

        ktFindService.get($scope.params, function(data) {
            $scope.recordDatas = data.res
            $scope._params.totalItems = data.count
            $scope.pageChanged = function() {
                $location.search($scope.params)
            }
            $timeout(function() {
                $scope.params.page = search.page || $scope.params.page
                $scope.params.per_page = search.per_page || $scope.params.per_page
            }, 100)
        })
    })
})()

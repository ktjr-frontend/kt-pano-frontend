;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktFindRecordCtrl', function($scope, $rootScope, ktFindService) {
        ktFindService.get({ page: 1, per_page: 50 }, function(data) {
            console.log(data)
            $scope.recordDatas = data.res
        })
    })
})()

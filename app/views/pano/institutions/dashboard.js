;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktInsitutionDashboardCtrl', function($scope, ktInstitutionalInfoService) {
        ktInstitutionalInfoService.get({}, function(data) {
            console.log(data)
            $scope.amounts = data.platform
            $scope.spv = data.spv
        })
    })
})()

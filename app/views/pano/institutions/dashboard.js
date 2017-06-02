;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktInsitutionDashboardCtrl', function($scope, ktInstitutionalInfoService) {
        ktInstitutionalInfoService.get({}, function(data) {
            $scope.amounts = data.platform
            $scope.spv = data.spv
        })
    })
})()

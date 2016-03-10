;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktConfirmCtrl', function($scope, $window, $stateParams, ktSweetAlert, ktLoginService, ktLoginCommon) {
            if ($.isEmptyObject($stateParams.institution)) {
                ktSweetAlert.error({
                    title: '访问出错',
                    text: '您的机构信息有错误！',
                    type: 'error'
                }, function() {
                    $window.history.back()
                })
            }

            $scope.user = $stateParams.user;
            $scope.institution = $stateParams.institution;

            $scope.submitForm = function() {
                ktLoginCommon(ktLoginService, $scope)
            }
        })
})();

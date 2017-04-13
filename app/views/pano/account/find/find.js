;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktFindCtrl', function($scope, $rootScope, ktFindService, ktSweetAlert, $state) {
        $scope.user = $rootScope.user

        $scope.user.cardFrontCanEdit = !$rootScope.user.card_url
        $scope.user.cardBackCanEdit = !$rootScope.user.card_back_url
        $scope.user.cardFrontVisible = $rootScope.user.card_url || ($scope.user.cardBackCanEdit && $scope.user.cardFrontCanEdit)
        $scope.user.cardBackVisible = $rootScope.user.card_back_url || ($scope.user.cardBackCanEdit && $scope.user.cardFrontCanEdit)
        $scope.findwx = $rootScope.user.wx

        //默认是否上传名片
        $scope.user.findForm = true
        $scope.findData = {
            search_whom: $scope.findpeo,
            search_target: $scope.findneed,
            wx: $scope.findwx
        }

        //提交按钮
        $scope.submitForm = function() {
            ktFindService.save($scope.findData, function(data) {
                console.log(data)
                ktSweetAlert.swal({
                    title: '提交成功',
                    text: 'PANO微信小助手将在1个工作日内与您沟通，如需联系请添加PANO酱微信：kaitongpano',
                    // type: 'warning',
                    html: false,
                    // showCancelButton: true
                }, function() {
                    $state.go('pano.findRecord')
                })
            }, function() {

            })
        }
    })
})();

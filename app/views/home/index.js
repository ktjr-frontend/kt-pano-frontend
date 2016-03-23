;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktIndexCtrl', function($scope, $rootScope) {

            $rootScope.goHome = function() {
                $state.go('home.index')
            }

            $scope.fullPageSettings = {
                onLeave: function(index, nextIndex, direction) {
                    $scope.$broadcast('fullPageSlide.' + index, {
                        type: 'out',
                        direction: direction
                    })
                    // console.log(index, nextIndex, direction)
                },
                afterLoad: function(anchorLink, index) {
                    $scope.$broadcast('fullPageSlide.' + index, {
                        type: 'in'
                    })
                    // console.log(anchorLink, index)
                }
            }

        })

})();

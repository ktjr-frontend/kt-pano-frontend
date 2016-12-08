;
(function() {
    'use strict';
    angular.module('kt.common')
        .directive('ktLineMenu', function($timeout, $window) {
            return {
                restrict: 'A',
                scope: {
                    menuData: '=menuData',
                    menuChange: '&',
                },
                link: function($scope, $element) {
                    var line = $element.find('.line') // 下划线对象
                    var width = line.data('width') // 下划线固定宽度
                    var activeEle
                    var offset = parseInt(line.data('offset')) // 下划线偏移量，默认单位px
                    var left

                    if ($window.innerWidth <= 480) {
                        offset = parseInt(line.data('mobile-offset'))
                    }

                    $timeout(function() {
                        if ($scope.menuData && $scope.menuData.index !== undefined) { // 由于指令使用孤立的scope，这里不能更改menuData默认指针，否则导致错误
                            activeEle = $element.find('.child').eq($scope.menuData.index)
                        } else {
                            activeEle = $element.find('.active')
                        }
                        if (activeEle.length) {
                            width = width || activeEle.width() + 'px'
                            left = !_.isNaN(offset) ? activeEle.position().left + offset : activeEle.position().left
                            line.css({
                                width: width,
                                left: left + 'px'
                            })
                        } else {
                            line.css({
                                left: '100%'
                            })
                        }
                    }, 10)

                    function updatePosition() {

                        var active = $element.find('.active')
                        var left
                        offset = parseInt(line.data('offset')) // 下划线偏移量，默认单位px

                        if ($window.innerWidth <= 480) {
                            offset = parseInt(line.data('mobile-offset'))
                        }

                        if (!active.length) {
                            line.css({
                                left: '100%'
                            })
                        } else {
                            left = !_.isNaN(offset) ? (offset + active.position().left) : active.position().left
                            width = width || active.width() + 'px'
                            line.css({
                                width: width,
                                left: left + 'px'
                            })
                        }
                    }

                    $($window).on('resize', updatePosition)
                    $scope.$on('lineMenuUpdate', function(event, data) {
                        $timeout(updatePosition, 10)
                    })

                    $element.find('.child').on('mouseenter', function() {
                            width = width || $(this).width() + 'px'
                            var left = !_.isNaN(offset) ? (offset + $(this).position().left) : $(this).position().left

                            line.css({
                                width: width,
                                left: left + 'px'
                            })
                        })
                        .on('mouseleave', updatePosition)
                        .on('click', function() {
                            var that = this
                            var menuValue = $(that).attr('menu-value')
                            $scope.$apply(function() {
                                $scope.menuData && ($scope.menuData.value = menuValue)
                                $scope.menuData && ($scope.menuData.index = $(that).index())
                                $scope.menuChange({ value: menuValue })
                            })
                        })
                }
            }
        })
})();

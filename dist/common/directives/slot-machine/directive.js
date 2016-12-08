/**
 * datepicker 指令
 * @require ['jQuery', 'animate.css']
 */
;
(function() {
    'use strict';
    angular.module('kt.common')
        .directive('ktSlotMachine', function($timeout) {
            return {
                restrict: 'AE',
                scope: {
                    effect: '@',
                    className: '@',
                    delay: '@',
                    version: '@',
                    placeholds: '='
                },
                replace: true,
                templateUrl: 'common/directives/slot-machine/template.html',
                controller: function($scope) {

                    $scope.getArray = function(n) {
                        return new Array(n)
                    }

                    $scope.slots = [{
                            name: '0',
                            destination: 12,
                            duration: 1.4,
                            state: 12,
                            delay: 0.5,
                            placehold: '4' //'<i class="fa fa-money"></i>'
                        }, {
                            name: '0',
                            destination: 12,
                            duration: 1.6,
                            state: 12,
                            delay: 0.55,
                            placehold: '2'
                        }, {
                            name: '0',
                            destination: 12,
                            duration: 1.8,
                            state: 12,
                            delay: 0.6,
                            placehold: '.'
                        }, {
                            name: '0',
                            destination: 12,
                            duration: 2,
                            state: 12,
                            delay: 0.65,
                            placehold: '0'
                        }, {
                            name: '0',
                            destination: 12,
                            state: 12,
                            duration: 2.2,
                            delay: 0.7,
                            placehold: '6' //'<i class="fa fa-cny"></i>'
                        }
                    ]
                },

                link: function($scope, element, attrs) {
                    var slots = $scope.slots
                    var placeholds = $scope.placeholds || [] //自定义展示内容

                    function updateSlots (newValue) {
                        _.map(slots, function(v, i) {
                            v.placehold = newValue[i] || v.placehold
                            return v
                        })
                    }

                    updateSlots(placeholds)
                    $scope.$watch('placeholds', function (newValue, oldValue) {
                        updateSlots(newValue)
                    })

                    var parentDelay = parseInt(attrs.delay || 0.1)

                    var emitBy = attrs.emitBy || '' // 基于什么触发
                    var slickElem = attrs.slickElem || '' //基于触发的slick的选择器
                    var slickItemIndex = $(element).closest('.slick-item').index()
                        // parentDelay += 0.1

                    $timeout(function() {
                        var slotDoms = element.find('.slot')
                        slotDoms.attr('data-state', '0')

                        slotDoms.each(function(i) {
                            var slot = slots[i]
                            $(this).css({
                                'animation-duration': slot.duration + 's',
                                'animation-delay': (slot.delay + parentDelay) + 's',
                                'animation-name': 'kt-roll-' + slot.destination,
                            })
                        })

                        slotDoms.on('oanimationend animationend webkitAnimationEnd MSAnimationEnd mozAnimationEnd', function() {
                            var slot = slots[$(this).index()]
                            $(this).attr('data-state', slot.state) // 开始翻牌，利用transition
                        })

                        slotDoms.css('animation-timing-function', 'cubic-bezier(0.57, -0.08, 0.32, 1.28)')
                        slotDoms.addClass('roll')

                        // slick 逻辑
                        if (emitBy === 'slick' && slickElem && $(slickElem).length) {

                            $(slickElem).on('beforeChange', function(e, slick, currS, nextS) {
                                if (currS === slickItemIndex)
                                    slotDoms.each(function() {
                                        $(this).attr('data-state', 0)
                                    })
                            })

                            $(slickElem).on('afterChange', function(e, slick, currS) {
                                if (currS === slickItemIndex)
                                    slotDoms.each(function(i) {
                                        var that = this
                                        $timeout(function() {
                                            var slot = slots[$(that).index()]
                                            $(that).attr('data-state', slot.state)
                                        }, 200 * i + 800, false)
                                    })
                            })

                        }
                    }, 1000, false)
                }
            }
        })
})();

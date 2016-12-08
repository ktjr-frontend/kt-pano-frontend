/**
 * @author luxueyan
 * @description datepicker 指令
 * @require ['jquery', 'jquery-date-range-picker', 'moment']
 */
;
(function() {
    'use strict';
    angular.module('kt.common')
        .directive('ktDatePicker', function() {
            return {
                restrict: 'A',
                scope: {
                    onUpdate: '&',
                    uibBtnRadio: '=',
                    datepickerSettings: '='
                },
                require: '?ngModel',
                /*compile: function ($scope, $element, $attrs) {

                    return this.link
                },*/
                link: function($scope, $element, $attrs, ngModel) {
                    // 转换逻辑值
                    $scope.period = $attrs.batchMode || 'false';
                    _.each($attrs, function(val, key) {
                        if (_.isString(val) && (val === 'true' || val === 'false')) {
                            $attrs[key] = $scope.$eval(val)
                        }
                    })

                    var id = _.uniqueId('datepicker-')
                    var options = $.extend({
                        separator: '~',
                        startOfWeek: 'monday',
                        // extraClass: id,
                        showShortcuts: true,
                        // singleDate: true,
                        applyBtnClass: 'btn btn-default btn-xs',
                        // customTopBar: function() { //自定义顶栏
                        //     var s = '<div class="btn-group btn-periods" role="group" aria-label="时间限制选择" title="可以限制选择时间">' +
                        //         '<label class="btn-primary btn btn-xs" ng-model="period" btn-radio="\'false\'">日</label>' +
                        //         '<label class="btn-primary btn btn-xs" ng-model="period" btn-radio="\'week\'">周</label>' +
                        //         '<label class="btn-primary btn btn-xs" ng-model="period" btn-radio="\'month\'">月</label>' +
                        //         '</div>'
                        //     return s;
                        // }
                    }, $scope.datepickerSettings, $attrs)

                    if (options.batchMode === 'month' || options.batchMode === 'month-range') {
                        options.customTopBar = function() {
                            return '<div class="normal-top">' +
                                '<span style="color:#333">已选择: </span> <b class="start-month">...</b> <span class="separator-day"> ~ </span> <b class="end-month">...</b>' +
                                '<i class="selected-days" style="display: inline;">(<span class="selected-months-num">...</span> 个月)</i></div>' +
                                '<div class="error-top">error</div>' +
                                '<div class="default-top">请选择一个日期范围</div>';

                        }
                    }

                    if (options.extraClass) options.extraClass = options.extraClass + ' ' + id;

                    // 自定义快键方式
                    if (options.shortcuts) {
                        options.shortcuts = $scope.$eval(options.shortcuts)
                    }

                    // 使用非input模式
                    // if ($element[0].tagName !== 'input') options.openType = 'span';
                    if (options.openType === 'span') {
                        $.extend(options, {
                            getValue: function() {
                                return this.innerHTML;
                            },
                            setValue: function(s) {
                                this.innerHTML = s;
                            }
                        })
                    }

                    /*$scope.$watch('period', function(newValue, oldValue) {
                        if (newValue !== oldValue) {
                            options.batchMode = newValue
                            $element.data('dateRangePicker').destroy()
                            var datePicker = initDatePicker()
                            // datePicker.open()
                        }
                    })*/

                    function initDatePicker() {
                        // 更新ngModel视图
                        $element.dateRangePicker(options).on('datepicker-apply', function(event, obj) {
                            if (!options.noUpdate) {
                                /*eslint-disable*/
                                $scope.uibBtnRadio && ($scope.uibBtnRadio = obj.value)
                                $scope.onUpdate && $scope.onUpdate({ value: obj.value })
                                    /*eslint-enable*/
                                if (ngModel) {
                                    ngModel.$setViewValue(obj.value, 'done');
                                    ngModel.$render();
                                }
                            }

                            $element.attr({
                                title: obj.value
                            })

                            // $scope.$apply()

                        }).on('datepicker-change', function(event, obj) {
                            if (options.batchMode === 'month' || options.batchMode === 'month-range') {
                                var selectedDates = obj.value.split('~')
                                var startDate = moment(selectedDates[0])
                                var endDate = moment(selectedDates[1])
                                    // var duration = moment.duration(endDate.diff(startDate))
                                $('.' + id + ' .start-month').text(startDate.format('YYYY年MM月'))
                                $('.' + id + ' .end-month').text(endDate.format('YYYY年MM月'))
                                $('.' + id + ' .selected-months-num').text(endDate.month() - startDate.month() + (endDate.year() - startDate.year()) * 12 + 1)
                            }

                        }).on('datepicker-first-date-selected', function(event, obj) {
                            if (options.batchMode === 'month' || options.batchMode === 'month-range') {
                                $('.' + id + ' .start-month').text(moment(obj.date1).format('YYYY年MM月'))
                            }

                        }).on('datepicker-opened', function() {
                            $element.parent().addClass('opened')
                        }).on('datepicker-closed', function() {
                            $element.parent().removeClass('opened')
                        }).on('datepicker-first-date-selected', function(event, obj) {
                            if (options.singleDate && options.autoClose) {
                                if (ngModel) {
                                    ngModel.$setViewValue(moment(obj.date1).format('YYYY-MM-DD'), 'done');
                                    ngModel.$render();
                                }
                            }
                        })

                        if (options.triggerEvent) { // 默认值得时候显示
                            setTimeout(function() {
                                $element.trigger(options.triggerEvent, { value: options.getValue() })
                            }, 100)
                        }

                        //编译自定义顶栏
                        // $compile($('.' + id + ' .btn-periods'))($scope)

                        return $element.data('dateRangePicker')
                    }

                    initDatePicker()
                }
            }
        })
})();

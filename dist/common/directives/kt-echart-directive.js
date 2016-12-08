;
(function() {
    'use strict';
    angular.module('kt.common')
        /**
         * 图表 echart 指令
         */
        .directive('ktEchart', function(ktEchartTheme1) {
            return {
                restrict: 'A',
                scope: {
                    chartOptions: '=chartOptions'
                },
                link: function($scope, $element, $attr) {
                    var myChart = echarts.init($element[0])
                    var theme = ktEchartTheme1 || {}
                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            shadowStyle: {
                                color: 'rgba(0,0,0,.1)'
                            },
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        toolbox: {
                            show: true,
                            orient: 'vertical',
                            x: 'right',
                            y: 'center',
                            feature: {
                                // mark: {
                                //     show: true
                                // },
                                dataView: {
                                    show: true,
                                    readOnly: false
                                },
                                magicType: {
                                    show: true,
                                    type: ['line', 'bar', 'stack', 'tiled']
                                },
                                restore: {
                                    show: true
                                },
                                saveAsImage: {
                                    show: true
                                }
                            }
                        },
                        yAxis: [{
                            type: 'value',
                            axisLabel: {
                                textStyle: {
                                    color: '#afb7d0',
                                    fontSize: 10
                                }
                            },
                        }],
                        /*legend: {
                            data: ['男', '女']
                        },
                        xAxis: [{
                            type: 'category',
                            data: ['2015年05月', '2015年06月', '2015年07月', '2015年08月', '2015年09月', '2015年10月']
                        }],
                        series: [
                            // 默认mock数据
                            {
                                name: '男',
                                type: 'bar',
                                barWidth: 40,
                                stack: '性别',
                                data: [0.11, 0.5, 0.43, 0.345, 0.85, 0.11]
                            }, {
                                name: '女',
                                type: 'bar',
                                stack: '性别',
                                data: [0.51, 0.1, 0.23, 0.345, 0.65, 0.001]
                            }
                        ]*/
                    }

                    $.extend(true, option, $scope.chartOptions || {})
                    myChart.setTheme(theme);
                    myChart.setOption(option);

                    myChart.on(echarts.config.EVENT.LEGEND_SELECTED, function(e) { //图列选择事件
                        $scope.$emit('legendSelected', {
                            chartId: $attr.id,
                            target: e.target,
                            targetValue: e.selected[e.target]
                        })
                    })

                    $element.data('echart', myChart) // dom上添加对myChart的引用

                    // 监听chartOptions
                    $scope.$watch('chartOptions', function(newValue) {
                        var finalOption = $.extend(true, {}, option, newValue || {})
                        myChart.setOption(finalOption, true);
                        // console && console.log('echart update')
                    });

                    $(window).on('resize', function() {
                        myChart.resize()
                    })

                    // 监听自定义图表选项更改事件
                    /*$attr.chartId && $scope.$on($attr.chartId + '.change', function(event, data) {
                        $.extend(true, option, $scope.chartOptions || {})
                        myChart.setOption(option);
                    })*/
                }
            }
        })
        .directive('ktEchartLegend', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function($scope, $element, $attr, ngModel) {
                    $element.on('change', function() {
                        var echart = $('#' + $attr.chartId).data('echart')
                        echart && echart.component.legend.setSelected($attr.name, ngModel.$modelValue)
                    })

                    $scope.$on('legendSelected', function(e, data) {
                        if ($attr.name === data.target && $attr.chartId === data.chartId) {
                            ngModel.$setViewValue(data.targetValue)
                            ngModel.$render()
                        }
                    })
                }
            }
        })
})();

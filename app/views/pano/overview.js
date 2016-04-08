;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOverviewCtrl', function($scope, $window, $stateParams, ktDataHelper, ktOverviewService, ktValueFactory, ktEchartTheme1) {

            $scope.updateDate = moment().subtract(7, 'd').format('YYYY-MM-DD') + ' ~ ' + moment().subtract(1, 'd').format('YYYY-MM-DD')

            var colors = ktEchartTheme1.color

            var rateAmountChart = $scope.rateAmountChart = {
                chartOptions: {},
                yAxis: 'amount',
                yAxisFormat: 'rmb',
                xAxis: 'rate',
                xAxisFormat: 'percent2',
                color: ['#dd4444'],
                list: []
            }

            var durationRateChart = $scope.durationRateChart = {
                chartOptions: {},
                yAxis: 'rate',
                yAxisFormat: 'percent2',
                xAxis: '_id',
                xAxisFormat: null,
                list: []
            }

            var durationAmountChart = $scope.durationAmountChart = {
                chartOptions: {},
                yAxis: 'amount',
                yAxisFormat: 'rmb',
                xAxis: '_id',
                xAxisFormat: null,
                list: []
            }

            var platformAssetTypeChart = $scope.platformAssetTypeChart = {
                chartOptions: {},
                yAxis: 'amount',
                yAxisFormat: 'percent2',
                xAxis: '_id',
                xAxisFormat: null,
                list: []
            }

            var chartOptions = {
                yAxis: {
                    axisLine: {
                        show: false,
                        lineStyle: {
                            width: 1,
                            color: '#afb7d0'
                        }
                    },
                    splitLine: { // 分隔线
                        show: true, // 默认显示，属性show控制显示与否
                        // onGap: null,
                        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                            color: ['#f3f3f3'],
                            width: 1,
                            type: 'solid'
                        }
                    },
                    splitArea: { // 分隔区域
                        show: false, // 默认不显示，属性show控制显示与否
                        // onGap: null,
                        areaStyle: { // 属性areaStyle（详见areaStyle）控制区域样式
                            color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)']
                        }
                    }
                },
                grid: {
                    right: 60,
                    // borderWidth: 1,
                },
                tooltip: {
                    valueType: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
                }
            }

            // 气泡图
            rateAmountChart.updateDataView = function() {
                var _self = this
                ktOverviewService.get({
                    chart: 'summary',
                }, function(data) {
                    _self.data = data.stat
                    updateView()
                })

                function updateView() {
                    var data = _self.data
                    var legend = _.map(data, function(v) {
                        return v[2]
                    })
                    var caculateOptions = ktDataHelper.chartOptions('#rateAmountChart', legend)

                    var xAxisArr = _.map(data, function(v) {
                        return v[0]
                    })
                    var yAxisArr = _.map(data, function(v) {
                        return v[1]
                    })

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        // color: _self.color,
                        legend: {
                            data: legend,
                        },
                        tooltip: {
                            // alwaysShowContent: true,
                            // enterable: true,
                            axisPointer: {
                                axis: 'auto',
                                type: 'line',
                            },
                            trigger: 'item',
                            triggerOn: 'mousemove',
                            formatter: function(params) {
                                var res = '<div class="f1_2rem chart-tooltip-title" style="border-bottom: 1px solid rgba(255,255,255,.3);padding-bottom: 5px;margin-bottom:5px;">' +
                                    params.value[2] + '</div><table class="f1_2rem chart-tooltip-table">' +
                                    '<tr><td class="justify">加权收益率：</td><td>' + ktValueFactory(params.value[0], _self.xAxisFormat) + '</td></tr>' +
                                    '<tr><td class="justify">' + params.seriesName + '：</td><td>' + ktValueFactory(params.value[1], _self.yAxisFormat) + '</td></tr>';
                                return res;
                            },
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        visualMap: [{
                                show: false,
                                dimension: 1,
                                min: _.min(yAxisArr),
                                max: _.max(yAxisArr),
                                precision: 1,
                                inRange: {
                                    symbolSize: [10, 50]
                                },
                                outOfRange: {
                                    symbolSize: [10, 50],
                                    color: ['rgba(0,0,0,.2)']
                                },

                            }
                            /*, {
                                show: false,
                                dimension: 0,
                                min: 0,
                                max: _.max(xAxisArr),
                                precision: 0.01,
                                inRange: {
                                    // colorSaturation: [0.1, 1],
                                    colorLightness: [0.9, 0.6]
                                },
                                outOfRange: {
                                    color: ['rgba(0,0,0,.2)']
                                },

                            }*/
                        ],
                        yAxis: {
                            name: '发行量（单位：万元）',
                            boundaryGap: true,
                            type: 'log',
                            // min: 0,
                            // max: (function() {
                            //     if (!yAxisArr.length) return 'auto'

                            //     var max = _.max(yAxisArr)
                            //     var maxLength = _.max(yAxisArr).toFixed(0).length
                            //     var maxyAxis = max + Math.pow(10, maxLength - 2) * 5

                            //     // 小于5的时候向下取整，否则向上取整
                            //     if (_.parseInt(maxyAxis.toString().slice(1, 2)) < 5) {
                            //         return _.floor(maxyAxis, 1 - maxLength)
                            //     }
                            //     return _.ceil(maxyAxis, 1 - maxLength)
                            // })()
                        },
                        xAxis: {
                            max: _.ceil(_.max(xAxisArr)),
                            min: _.floor(_.min(xAxisArr)),
                            type: 'value',
                            name: '收益率',
                            nameLocation: 'end',
                            nameGap: 10,
                            boundaryGap: false,
                        },

                        series: _.map(data, function(v) {
                            return {
                                name: v[2],
                                showEffectOn: 'emphasis',
                                type: 'effectScatter',
                                rippleEffect: {
                                    period: 8,
                                    scale: 1.5,
                                    brushType: 'fill'
                                },
                                data: [v]
                            }
                        })
                    })
                }
            }

            durationRateChart.updateDataView = function() {
                var _self = this

                ktOverviewService.get({
                    chart: 'rate',
                }, function(data) {
                    _self.data = ktDataHelper.chartDataPrune(data.stat)
                    updateView()
                })

                function updateView() {
                    var data = _self.data
                    var legend = _.map(data.data, 'name')
                    var caculateOptions = ktDataHelper.chartOptions('#durationRateChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        legend: {
                            data: legend
                        },
                        tooltip: {
                            axisPointer: {
                                axis: 'auto',
                                type: 'line',
                            },

                            xAxisFormat: _self.xAxisFormat,
                            titlePrefix: '产品期限：',
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: {
                            name: '收益率（单位：%）',
                            max: ktDataHelper.getAxisMax(data.data),
                            min: ktDataHelper.getAxisMin(data.data)
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            name: '期限',
                            nameLocation: 'end',
                            nameGap: 10,
                            data: ktDataHelper.chartAxisFormat(data.xAxis, 'MY')
                        },

                        series: _.map(data.data, function(v) {
                            return {
                                name: v.name,
                                type: 'line',
                                markLine: {
                                    data: ktDataHelper.getMarkLineCoords(v.data)
                                },
                                // symbol: 'path://M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0',
                                smooth: false,
                                data: v.data
                            }
                        })
                    })
                }
            }

            durationAmountChart.updateDataView = function() {
                var _self = this
                ktOverviewService.get({
                    chart: 'circulation',
                }, function(data) {
                    _self.data = ktDataHelper.chartDataPrune(data.stat)
                    updateView()
                })

                function updateView() {
                    var data = _self.data
                    var legend = _.map(data.data, 'name')
                    var caculateOptions = ktDataHelper.chartOptions('#durationAmountChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        legend: {
                            data: legend
                        },
                        tooltip: {
                            titlePrefix: '产品期限：',
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: {
                            name: '发行量（单位：万元）',
                        },
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            name: '期限',
                            nameLocation: 'end',
                            nameGap: 10,
                            data: ktDataHelper.chartAxisFormat(data.xAxis, 'MY')
                        },

                        series: _.map(data.data, function(v) {
                            return {
                                name: v.name,
                                type: 'bar',
                                barMaxWidth: 40,
                                data: v.data
                            }
                        })
                    })
                }
            }

            platformAssetTypeChart.updateDataView = function() {
                var _self = this
                ktOverviewService.get({
                    chart: 'circulation_pct',
                }, function(data) {
                    _self.data = ktDataHelper.chartDataToPercent(data.stat)
                    updateView()
                })

                function updateView() {
                    var data = _self.data
                    var legend = _.map(data.data, 'name')
                    var caculateOptions = ktDataHelper.chartOptions('#platformAssetTypeChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        color: _.reverse(colors.slice(0, legend.length)),
                        legend: {
                            data: legend
                        },
                        tooltip: {
                            reverse: true,
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: {
                            name: '类型占比（单位：%）',
                            max: 100,
                            min: 0
                        },
                        xAxis: {
                            type: 'category',
                            name: '平台',
                            nameLocation: 'end',
                            nameGap: 10,
                            axisLabel: {
                                interval: $window.innerWidth > 1000 ? 0 : 'auto'
                            },
                            boundaryGap: true,
                            data: data.xAxis
                        },

                        series: _.map(_.reverse(data.data), function(v) {
                            return {
                                name: v.name,
                                type: 'bar',
                                stack: '类型占比',
                                barMaxWidth: 40,
                                data: v.data
                            }
                        })
                    })
                }
            }

            // 初始加载数据
            rateAmountChart.updateDataView()
            durationRateChart.updateDataView()
            durationAmountChart.updateDataView()
            platformAssetTypeChart.updateDataView()

        })
})();

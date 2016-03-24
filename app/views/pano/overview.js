;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOverviewCtrl', function($scope, $stateParams, ktDataHelper, ktOverviewService, ktValueFactory) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.updateDate = moment().subtract(1, 'd').format('YYYY-MM-DD')

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
                tooltip: {
                    valueType: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
                }
            }

            rateAmountChart.udpateDataView = function() {
                var _self = this
                ktOverviewService.get({
                    chart: 'summary',
                }, function(data) {
                    _self.data = data.stat
                    updateView()
                })

                function updateView() {
                    var data = _self.data

                    var xAxisArr = _.map(data, function(v) {
                        return v[0]
                    })
                    var yAxisArr = _.map(data, function(v) {
                        return v[1]
                    })

                    _self.chartOptions = $.extend(true, {}, chartOptions, {
                        // color: _self.color,
                        legend: {
                            data: _.map(data, function(v) {
                                return v[2]
                            }),
                        },
                        tooltip: {
                            axisPointer: {
                                axis: 'auto',
                                type: 'line',
                            },
                            trigger: 'item',
                            triggerOn: 'mousemove',
                            alwaysShowContent: false,
                            formatter: function(params) {
                                var res = '<div class="f1_3rem" style="border-bottom: 1px solid rgba(255,255,255,.3);padding-bottom: 5px;margin-bottom:5px;">' +
                                    params.value[2] + '</div>' +
                                    '<div class="f1_2rem">加权收益率 : ' + ktValueFactory(params.value[0], _self.xAxisFormat) + '</div>' +
                                    '<div>' + params.seriesName + ' : ' + ktValueFactory(params.value[1], _self.yAxisFormat) + '</div>';
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
                        yAxis: [{
                            name: '发行量（单位：万元）',
                            boundaryGap: true,
                            min: 0,
                            // max: _.max(yAxisArr) + 1000000
                        }],
                        xAxis: [{
                            max: _.ceil(_.max(xAxisArr)),
                            type: 'value',
                            boundaryGap: false,
                        }],

                        series: _.map(data, function(v) {
                            return {
                                name: v[2],
                                type: 'scatter',
                                data: [v]
                            }
                        })
                    })
                }
            }

            durationRateChart.udpateDataView = function() {
                var _self = this
                ktOverviewService.get({
                    chart: 'rate',
                }, function(data) {
                    // data = { "stat": { "xAxis": [1, 3, 6, 12, 24], "data": [{ "name": "上周收益率", "data": [0.17, null, 2.3, null, 0.03] }, { "name": "本周收益率", "data": [null, null, 1.04, null, 5.02] }] } }
                    _self.data = data.stat
                    updateView()
                })

                function updateView() {
                    var data = _self.data

                    _self.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.map(data.data, 'name'),
                        },
                        tooltip: {
                            axisPointer: {
                                axis: 'auto',
                                type: 'line',
                            },

                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: [{
                            name: '收益率（单位：%）'
                        }],
                        xAxis: [{
                            type: 'category',
                            boundaryGap: true,
                            data: data.xAxis
                        }],

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

            durationAmountChart.udpateDataView = function() {
                var _self = this
                ktOverviewService.get({
                    chart: 'circulation',
                }, function(data) {
                    _self.data = data.stat
                    updateView()
                })

                function updateView() {
                    var data = _self.data

                    _self.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.map(data.data, 'name'),
                        },
                        tooltip: {
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: [{
                            name: '发行量（单位：万元）'
                        }],
                        xAxis: [{
                            type: 'category',
                            boundaryGap: true,
                            data: data.xAxis
                        }],

                        series: _.map(data.data, function(v) {
                            return {
                                name: v.name,
                                type: 'bar',
                                data: v.data
                            }
                        })
                    })
                }
            }

            platformAssetTypeChart.udpateDataView = function() {
                var _self = this
                ktOverviewService.get({
                    chart: 'circulation_pct',
                }, function(data) {
                    _self.data = data.stat
                    updateView()
                })

                function updateView() {
                    var data = _self.data

                    _self.chartOptions = $.extend(true, {}, chartOptions, {
                        legend: {
                            data: _.map(data.data, 'name'),
                        },
                        tooltip: {
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: [{
                            name: '类型占比（单位：%）',
                            max: 1,
                            min: 0
                        }],
                        xAxis: [{
                            type: 'category',
                            axisLabel: {
                                interval: 0
                            },
                            boundaryGap: true,
                            data: data.xAxis
                        }],

                        series: _.map(data.data, function(v) {
                            return {
                                name: v.name,
                                type: 'bar',
                                stack: '类型占比',
                                data: v.data
                            }
                        })
                    })
                }
            }

            // 初始加载数据
            rateAmountChart.udpateDataView()
            durationRateChart.udpateDataView()
            durationAmountChart.udpateDataView()
            platformAssetTypeChart.udpateDataView()

        })
})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktMarketCtrl', function($scope, $rootScope, $q, $state, $timeout, $location, ktDataHelper, ktAnalyticsService, ktEchartTheme1) {
            var shared = $scope.shared
            var params = shared.params
            shared.tabActive.tab0 = true
            shared.filter_show = true
            var search = $location.search()
            $.extend(params, search)
            ktDataHelper.pruneDirtyParams(params, search, ['from', 'mapped_exchange', 'asset_type'])

            $scope.updateDate = '获取中...'
            ktDataHelper.filterUpdate(shared.filters, shared.params)

            var colors = ktEchartTheme1.color
            var isAllDimension = params[params.dimension] === 'all' || !params[params.dimension] // 是否是当前维度的所有筛选

            // var defaultShowLength = (function() { // 默认显示的几个legend，根据不同维度展示不同的长度
            //     var d = params.dimension
            //     if (d === 'asset_type') {
            //         return 8
            //     } else if (d === 'from') {
            //         return 12
            //     }
            //     return 6
            // })()
            var defaultShowLength = 10
            var legendSelected = {} //默认选中的图例
            var getSelectedLegend = function(xAxis) {
                if (_.isEmpty(legendSelected)) {
                    _.each(xAxis, function(v, i) {
                        legendSelected[v] = i < defaultShowLength
                    })
                }
            }
            var rightGap = 40 // 图表主体距离右边距离
            var leftGap = 65
            var topGap = 50
            var bottomGap = isAllDimension ? 140 : 80
            var shortDatePeriod = function(xAxis) { //横轴显示简略的格式
                return _.map(xAxis, function(x) {
                    return moment(x).format('MMDD~') + moment(x).weekday(6).format('MMDD')
                })
            }

            var loadingSettings = { // 设置图表异步加载的样式
                text: '努力加载中...',
                color: '#3d4351',
                textColor: '#3d4351',
            }

            var chartOptions = {
                tooltip: {
                    valueType: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
                },
                toolbox: {
                    show: false,
                },
                legend: {
                    left: isAllDimension ? leftGap - 25 : 'center',
                    right: rightGap / 2,
                    textStyle: {
                        fontSize: 12,
                        color: '#626472' // 图例文字颜色
                    }
                },
                yAxis: {
                    nameGap: 20,
                    splitLine: { // 分隔线
                        show: true, // 默认显示，属性show控制显示与否
                        // onGap: null,
                        lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                            color: ['#f3f3f3'],
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                grid: {
                    show: true,
                    top: topGap,
                    left: leftGap,
                    right: rightGap, // 距离右面的距离
                    bottom: bottomGap, // 距离底部的距离
                    // borderWidth: 0,
                    // backgroundColor: '#fafafa',
                }
            }

            if (params.dimension === 'asset_type') {
                chartOptions.color = ktDataHelper.getDimentionSpecialColor('asset_type')
            }

            /*    <!-- 给设计师调色用 上线注释掉 --> */
            /*$scope.tmplColor = ''
            $scope.$watch('tmplColor', function(newValue) {
                var color = _.map(newValue.split(','), _.trim)
                if (!color.length) return
                echarts.getInstanceByDom($('#weekAmountChart')[0]).setOption({
                    color: color
                })
                echarts.getInstanceByDom($('#durationAmountChart')[0]).setOption({
                    color: color
                })
                echarts.getInstanceByDom($('#weekRateChart')[0]).setOption({
                    color: color
                })
                echarts.getInstanceByDom($('#durationRateChart')[0]).setOption({
                    color: color
                })
            });*/

            $scope.$watch('weekAmountChart.chartOptions.filterVisible', function(newValue) {
                if (_.isUndefined(newValue)) return

                ga('send', {
                    hitType: 'event',
                    eventCategory: '观察窗按钮',
                    eventAction: newValue ? '打开' : '关闭',
                    eventLabel: '市场数据 发行量趋势图',
                })
                newValue && $rootScope.bdTrack(['市场数据页', '打开', '资产产品发行量趋势图', '观察窗']) // eslint-disable-line
            })

            $scope.$watch('weekRateChart.chartOptions.filterVisible', function(newValue) {
                if (_.isUndefined(newValue)) return

                ga('send', {
                    hitType: 'event',
                    eventCategory: '观察窗按钮',
                    eventAction: newValue ? '打开' : '关闭',
                    eventLabel: '市场数据 收益率趋势图',
                })
                newValue && $rootScope.bdTrack(['市场数据页', '打开', '资产产品收益率趋势图', '观察窗']) // eslint-disable-line
            })

            // 自定义缩放组件的位置初始化，百分比
            function getStartEndPercent(data) {
                var l = data.xAxis.length
                var minWidth = l > 1 ? 100 / (l - 1) : 50
                var lpps = _.map(data.xAxis, function(v, i) { // 横轴文本的位置百分比
                    // return (i + 1 / 2) * minWidth
                    return l > 1 ? i * minWidth : 50 // 一个点特殊处理
                })

                // // var start = l > 2 ? 100 - (100 / (l - 1)) * 3 / 2 : 25
                // // var end = l > 2 ? 100 - (100 / (l - 1)) / 2 : 75
                // /*eslint-disable*/
                // var start = l === 1 ? 25 : (l === 2 ? 0 : 100 - minWidth * 3 / 2) // 特殊里1个点和2个点的时候
                // var end = l === 1 ? 75 : (l === 2 ? 50 : 100 - minWidth / 2)
                //     /*eslint-enable*/

                // if (end - start < 5) {
                //     start = end - 5
                // }

                return {
                    xAxisPositionPercents: lpps,
                    minWidth: _.floor(minWidth / 3),
                    start: 0,
                    end: 100
                        // start: start,
                        // end: end
                }
            }

            // 用于联动表格的日期初始化显示
            function getStartEnd() {
                /*var start = moment(params.start_at)
                var end = moment(params.end_at)
                var isGtOneWeek = end.weeks() - start.weeks() > 0

                return {
                    start_at: isGtOneWeek ? moment(params.end_at).weekday(0).subtract(1, 'w').format('YYYY-MM-DD') : moment(params.start_at).weekday(0).format('YYYY-MM-DD'),
                    end_at: isGtOneWeek ? moment(params.end_at).weekday(6).subtract(1, 'w').format('YYYY-MM-DD') : moment(params.end_at).weekday(6).format('YYYY-MM-DD'),
                }*/
                return {
                    start_at: params.start_at,
                    end_at: params.end_at
                }
            }

            // 自定义的观察窗
            function customDataZoom(chart, options) {
                var updatePromise

                return $.extend(true, {}, {
                    show: true,
                    attr: {
                        group: 'group1'
                    },
                    styles: {
                        position: 'absolute',
                        left: leftGap - 1,
                        right: rightGap - 1,
                        bottom: bottomGap,
                        // height: isAllDimension ? 220 : 280,
                        top: topGap,
                    },
                    onZoom: function(e) {
                        if (e.triggerType === 'manual') return

                        var opts = chart.getOption()
                        var lpps = opts.customDataZoom.xAxisPositionPercents
                        var xAxis = opts.xAxis[1]

                        // var l = xAxis.data.length
                        var coverxAxis = _.chain(lpps).map(function(v, i) {
                            return (v <= e.end && v >= e.start) ? i : null
                        }).filter(function(v) {
                            return !_.isNull(v)
                        }).value()

                        // @old 没有间隙的处理方法
                        // var startDate = xAxis.data[((l - 1) * e.start.toFixed(2) / 100) | 0]
                        // var endDate = moment(xAxis.data[((l - 1) * e.end.toFixed(2) / 100) | 0]).day(0).add(1, 'w').format('YYYY-MM-DD')
                        var startDate
                        var endDate
                        if (!coverxAxis.length) {
                            startDate = '-' // 错误的时间值，图表清空
                            endDate = '-'
                        } else {
                            startDate = xAxis.data[coverxAxis[0]]
                            endDate = moment(xAxis.data[coverxAxis.pop()]).day(0).add(1, 'w').format('YYYY-MM-DD')
                        }

                        if (durationAmountChart._params.start_at === startDate && durationAmountChart._params.end_at === endDate) {
                            return
                        }

                        $timeout.cancel(updatePromise)
                        updatePromise = $timeout(function() {
                            durationAmountChart.updateDataView({
                                start_at: startDate,
                                end_at: endDate
                            }, true)

                            durationRateChart.updateDataView({
                                start_at: startDate,
                                end_at: endDate
                            }, true)

                            ga('send', {
                                hitType: 'event',
                                eventCategory: '观察窗窗体',
                                eventAction: '有效拖拽',
                                eventLabel: '市场数据' + (chart.getDom().id === 'weekAmountChart' ? '发行量趋势图' : '收益率趋势图'),
                            })
                        }, 500)
                    }
                }, options || {})
            }

            /*function dataZoom(chart, options) {
                var updatePromise
                return [$.extend({
                    show: true,
                    realtime: false,
                    throttle: 500,
                    top: 50,
                    showDataShadow: false,
                    showDetail: false,
                    fillerColor: 'rgba(144,197,237,0.2)', // 填充颜色
                    handleColor: 'rgba(70,130,180,0.4)',
                    handleSize: 3,
                    textStyle: {
                        color: 'transparent'
                    },
                    left: 65,
                    height: isAllDimension ? 220 : 280,
                    start: 0,
                    end: 100,
                    backgroundColor: 'rgba(0,0,0,0)', // 背景颜色
                    dataBackgroundColor: 'rgba(0,0,0,0)', // 数据背景颜色
                    xAxisIndex: 1,
                    onZoom: function(e) {
                        if (e.triggerType === 'manual') return

                        var xAxis = this.getOption().xAxis[1]
                        var l = xAxis.data.length
                        var startDate = xAxis.data[((l - 1) * e.start.toFixed(2) / 100) | 0]
                        var endDate = moment(xAxis.data[((l - 1) * e.end.toFixed(2) / 100) | 0]).day(0).add(1, 'w').format('YYYY-MM-DD')
                            // console.log(e.start, e.end, Math.ceil((l - 1) * e.start.toFixed(2) / 100), ((l - 1) * e.end.toFixed(2) / 100) | 0, startDate, endDate)

                        chart.dispatchAction({
                            type: 'dataZoom',
                            triggerType: 'manual', //自定义属性，避免死循环
                            // 可选，dataZoom 组件的 index，多个 dataZoom 组件时有用，默认为 0
                            // dataZoomIndex: number,
                            // 开始位置的百分比，0 - 100
                            start: e.start,
                            // 结束位置的百分比，0 - 100
                            end: e.end,
                            // 开始位置的数值
                            // startValue: number,
                            // 结束位置的数值
                            // endValue: number
                        })

                        $timeout.cancel(updatePromise)
                        updatePromise = $timeout(function() {
                            $scope.durationAmountChart.updateDataView({
                                start_at: startDate,
                                end_at: endDate
                            }, true)

                            $scope.durationRateChart.updateDataView({
                                start_at: startDate,
                                end_at: endDate
                            }, true)
                        }, 500)

                        // console.log(e.start, e.end, e.startValue)
                        // console.log(startDate, endDate, (l - 1) * e.end.toFixed(2) / 100, (l - 1) * e.start.toFixed(2) / 100)
                    },
                    type: 'slider'
                }, options || {})]
            }*/

            // 左1图-发行量周统计
            var weekAmountChart = $scope.weekAmountChart = {
                chartOptions: {},
                _params: {},
                xAxis: params.dimension,
                yAxisFormat: 'rmb',
                yAxis: 'amount',
                xAxisFormat: null,
                list: []
            }
            weekAmountChart.updateDataView = function(paramObj) {
                var _self = this
                $.extend(_self._params, paramObj || {})

                ktAnalyticsService.get(ktDataHelper.cutDirtyParams($.extend(true, {}, params, {
                    content: 'detail',
                    chart: 'circulation_group_by_week_and_from',
                }, _self._params)), function(data) {
                    if (data.crawled_at) {
                        $scope.updateDate = moment(data.crawled_at).format('YYYY-MM-DD')
                    }

                    _self.data = ktDataHelper.chartDataPrune(data.stat)
                    updateView()
                })

                function updateView() {
                    var chart = _self.echart = echarts.getInstanceByDom($('#weekAmountChart')[0])
                    var data = _self.data
                    var legend = _.map(data.data, 'name')
                    getSelectedLegend(legend)
                    var color = _self.color || chartOptions.color || colors.slice(0, legend.length)

                    var caculateOptions = ktDataHelper.chartOptions('#weekAmountChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                            color: _.reverse(color.slice(0)),
                            legend: {
                                data: legend,
                                selected: legendSelected,
                            },
                            customDataZoom: customDataZoom(chart, $.extend(getStartEndPercent(data), {
                                styles: {
                                    bottom: caculateOptions.grid.bottom
                                }
                            })),
                            tooltip: {
                                // alwaysShowContent: true,
                                // enterable: true,
                                // show: false,
                                // showContent: false,
                                // triggerOn: 'click',
                                // trigger: 'item',
                                axisPointer: {
                                    axis: 'auto',
                                    type: 'line',
                                },
                                reverse: true,
                                titlexAxisIndex: 1,
                                titleFormat: '@ToWeekEnd',
                                titleSuffix: '发行量',
                                // noUnit: true,
                                xAxisFormat: _self.xAxisFormat,
                                yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                            },
                            yAxis: {
                                name: '发行量（万元）',
                                // type: 'log'
                            },
                            xAxis: [{
                                type: 'category',
                                name: '周',
                                nameLocation: 'end',
                                axisLabel: {
                                    interval: (data.xAxis.length > 6 || window.detectmob()) ? 'auto' : 0
                                },
                                axisTick: {
                                    show: false,
                                    interval: 0
                                },
                                nameGap: 10,
                                boundaryGap: false,
                                data: shortDatePeriod(data.xAxis)
                            }, {
                                type: 'category',
                                axisLabel: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                boundaryGap: false,
                                data: data.xAxis
                            }],

                            series: _.map(_.reverse(data.data), function(v) {
                                return {
                                    name: v.name,
                                    xAxisIndex: 0,
                                    stack: '总量',
                                    itemStyle: {
                                        emphasis: {
                                            shadowColor: 'rgba(0,0,0,.5)'
                                        }
                                    },
                                    areaStyle: { normal: {} },
                                    type: 'line',
                                    smooth: false,
                                    data: v.data
                                }
                            })
                        })
                        /*eslint-disable*/
                    chart && chart.hideLoading()
                        /*eslint-enable*/
                }
            }

            // 右1图-发行量期限统计
            var durationAmountChart = $scope.durationAmountChart = {
                chartOptions: {},
                _params: getStartEnd(),
                xAxis: params.dimension,
                yAxisFormat: 'rmb', //percent2 意思不需要*100
                yAxis: 'amount',
                xAxisFormat: null,
                list: []
            }
            durationAmountChart.updateDataView = function(paramObj, silent) {
                var _self = this
                var chart = _self.echart = echarts.getInstanceByDom($('#durationAmountChart')[0])
                $.extend(_self._params, paramObj || {})

                if (silent) {
                    if (chart) {
                        chart.hideLoading()
                        chart.showLoading(loadingSettings)
                    }
                }

                ktAnalyticsService.get(ktDataHelper.cutDirtyParams($.extend(true, {}, params, {
                    content: 'detail',
                    chart: 'circulation_group_by_life_days_and_from',
                }, _self._params)), function(data) {
                    _self.data = ktDataHelper.chartDataPrune(data.stat)
                    updateView()
                }, function() {
                    _self.data = { data: [], xAxis: [] }
                    updateView()
                })

                function initChartOptions() {
                    var data = _self.data
                    var caculateOptions = ktDataHelper.chartOptions('#durationAmountChart', _.map(data.data, 'name'))

                    return $.extend(true, {}, chartOptions, caculateOptions, {
                        tooltip: {
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat, //自定义属性，tooltip标示，决定是否显示百分比数值
                            reverse: true,
                        },
                        yAxis: {
                            name: '发行量（万元）'
                        },
                        xAxis: {
                            type: 'category',
                            name: '期限',
                            nameLocation: 'end',
                            nameGap: 10,
                            boundaryGap: true,
                            data: ktDataHelper.chartAxisFormat(data.xAxis, 'MY')
                        },

                    })
                }

                function updateView() {
                    var initOptions = initChartOptions()
                    var data = _self.data
                    var legend = _.map(data.data, 'name')
                    getSelectedLegend(legend)
                    var color = _self.color || chartOptions.color || colors.slice(0, legend.length)

                    _self.chartOptions = $.extend(true, {}, initOptions, {
                            color: _.reverse(color.slice(0)),
                            legend: {
                                data: legend,
                                selected: silent ? chart.getOption().legend[0].selected : legendSelected,
                            },
                            /*yAxis: [{
                                max: ktDataHelper.getAxisMax(data.data),
                                min: 0,
                            }],*/
                            series: _.map(_.reverse(data.data), function(v) {
                                return {
                                    name: v.name,
                                    itemStyle: {
                                        normal: {
                                            opacity: 0.8,
                                        },
                                        emphasis: {
                                            barBorderWidth: 1,
                                            barBorderColor: 'rgba(0,0,0,.5)'
                                        }
                                    },
                                    stack: '总量',
                                    type: 'bar',
                                    barWidth: 30,
                                    data: v.data
                                }
                            })
                        })
                        /*eslint-disable*/
                    chart && chart.hideLoading()
                        /*eslint-enable*/
                }
            }

            // 左2图-收益率周统计
            var weekRateChart = $scope.weekRateChart = {
                chartOptions: {},
                xAxis: params.dimension,
                yAxisFormat: 'percent2', //percent2 意思不需要*100
                yAxis: 'rate',
                _filters: [{
                    name: '期限：',
                    onToggle: function(open) { // 期限筛选下拉菜单
                        if (open) {
                            $rootScope.bdTrack(['市场数据页', '下拉', '资产收益率趋势图'])
                        }
                    },
                    options: [{
                        name: '1M',
                        value: 1
                    }, {
                        name: '3M',
                        value: 3
                    }, {
                        name: '6M',
                        value: 6
                    }, {
                        name: '1Y',
                        value: 12
                    }, {
                        name: '2Y',
                        value: 24
                    }]
                }],
                _getParamName: function(index) {
                    return _.find(this._filters[index].options, { value: this._params.life }).name
                },
                _params: {
                    life: 6
                },
                xAxisFormat: null,
                list: []
            }
            weekRateChart.updateDataView = function(paramObj, silent) {
                var _self = this
                var chart = _self.echart = echarts.getInstanceByDom($('#weekRateChart')[0])
                $.extend(_self._params, paramObj || {})

                if (silent) {
                    if (chart) {
                        chart.hideLoading()
                        chart.showLoading(loadingSettings)
                    }
                }

                ktAnalyticsService.get(ktDataHelper.cutDirtyParams($.extend(true, {}, params, {
                    content: 'detail',
                    chart: 'rate_group_by_week_and_from',
                }, _self._params)), function(data) {
                    _self.data = ktDataHelper.chartDataPrune(data.stat)
                    updateView()
                })

                function updateView() {
                    var data = _self.data
                    var legend = _.map(data.data, 'name')
                    var echart = _self.echart = echarts.getInstanceByDom($('#weekRateChart')[0])
                    getSelectedLegend(legend)

                    var caculateOptions = ktDataHelper.chartOptions('#weekRateChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                            legend: {
                                data: legend,
                                selected: legendSelected,
                            },
                            customDataZoom: customDataZoom(echart, $.extend(getStartEndPercent(data), {
                                styles: {
                                    bottom: caculateOptions.grid.bottom
                                }
                            })),
                            tooltip: {
                                axisPointer: {
                                    axis: 'auto',
                                    type: 'line',
                                },
                                titleFormat: '@ToWeekEnd',
                                titlexAxisIndex: 1,
                                titleSuffix: '收益率',
                                xAxisFormat: _self.xAxisFormat,
                                yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                            },
                            yAxis: {
                                name: '收益率（%）',
                                interval: 1,
                                max: ktDataHelper.getAxisMax(data.data),
                                min: 0,
                            },
                            xAxis: [{
                                type: 'category',
                                name: '周',
                                nameLocation: 'end',
                                axisLabel: {
                                    interval: (data.xAxis.length > 6 || window.detectmob()) ? 'auto' : 0
                                },
                                axisTick: {
                                    show: false,
                                    interval: 0
                                },
                                nameGap: 10,
                                boundaryGap: false,
                                data: shortDatePeriod(data.xAxis)
                            }, {
                                type: 'category',
                                axisLabel: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                boundaryGap: false,
                                data: data.xAxis
                            }],

                            series: _.map(data.data, function(v) {
                                return {
                                    name: v.name,
                                    type: 'line',
                                    xAxisIndex: 0,
                                    markLine: {
                                        data: ktDataHelper.getMarkLineCoords(v.data)
                                    },
                                    smooth: false,
                                    data: v.data
                                }
                            })
                        })
                        /*eslint-disable*/
                    chart && chart.hideLoading()
                        /*eslint-enable*/
                }
            }

            // 右2图-收益率期限统计
            var durationRateChart = $scope.durationRateChart = {
                _params: getStartEnd(),
                chartOptions: {},
                xAxis: params.dimension,
                yAxisFormat: 'percent2', //percent2 意思不需要*100
                yAxis: 'rate',
                xAxisFormat: null,
                list: []
            }
            durationRateChart.updateDataView = function(paramObj, silent) {
                var _self = this
                var chart = _self.echart = echarts.getInstanceByDom($('#durationRateChart')[0])
                $.extend(_self._params, paramObj || {})

                if (silent) {
                    if (chart) {
                        chart.hideLoading()
                        chart.showLoading(loadingSettings)
                    }
                }

                ktAnalyticsService.get(ktDataHelper.cutDirtyParams($.extend(true, {}, params, {
                    content: 'detail',
                    chart: 'rate_group_by_life_days_and_from',
                }, _self._params)), function(data) {
                    _self.data = ktDataHelper.chartDataPrune(data.stat)
                    updateView()
                }, function() {
                    _self.data = { data: [], xAxis: [] }
                    updateView()
                })

                function initChartOptions() {
                    var data = _self.data
                    var caculateOptions = ktDataHelper.chartOptions('#durationRateChart', _.map(data.data, 'name'))

                    return $.extend(true, {}, chartOptions, caculateOptions, {
                        tooltip: {
                            axisPointer: {
                                axis: 'auto',
                                type: 'line',
                            },

                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: {
                            name: '收益率（%）',
                        },
                        xAxis: {
                            type: 'category',
                            name: '期限',
                            nameLocation: 'end',
                            nameGap: 10,
                            boundaryGap: false,
                            data: ktDataHelper.chartAxisFormat(data.xAxis, 'MY')
                        },

                    })
                }

                function updateView() {
                    var data = _self.data
                    var initOptions = initChartOptions()
                    var legend = _.map(data.data, 'name')
                    getSelectedLegend(legend)
                    _self.chartOptions = $.extend(true, {}, initOptions, {
                            legend: {
                                data: _.map(data.data, 'name'),
                                selected: silent ? chart.getOption().legend[0].selected : legendSelected,
                            },
                            yAxis: {
                                interval: 1,
                                max: ktDataHelper.getAxisMax(data.data),
                                min: 0,
                            },
                            series: _.map(data.data, function(v) {
                                return {
                                    name: v.name,
                                    type: 'line',
                                    markLine: {
                                        data: ktDataHelper.getMarkLineCoords(v.data)
                                    },
                                    smooth: false,
                                    data: v.data
                                }
                            })
                        })
                        /*eslint-disable*/
                    chart && chart.hideLoading()
                        /*eslint-enable*/
                }
            }

            weekAmountChart.updateDataView()
            durationAmountChart.updateDataView()
            weekRateChart.updateDataView()
            durationRateChart.updateDataView()

        })
})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktInsitutionCtrl', function($scope, $location, $state, ktInsitutionsService, ktAnalyticsService, ktCompassAssetService, ktDataHelper, ktValueFactory) {

            var defaultParams = {
                dimension: 'from',
                start_at: moment().day(0).add(+(moment().day() > 0), 'w').subtract(6, 'weeks').add(1, 'days').format('YYYY-MM-DD'),
                end_at: moment().day(0).add(+(moment().day() > 0), 'w').format('YYYY-MM-DD'),
            }
            var search = $location.search()
            var params = $scope.params = $.extend({}, defaultParams, search)
            params[params.dimension] = $state.params.id

            // 交易所和互联网金融平台的合作伙伴是相互的
            $scope.partnerType = function() {
                if (params.dimension === 'from') {
                    return 'mapped_exchange'
                } else if (params.dimension === 'mapped_exchange') {
                    return 'from'
                }
            }

            $scope.tabActive = {
                tab1: true,
                tab2: false
            }

            // 更多图表视图
            $scope.moreChartView = function() {
                var data = {
                    dimension: params.dimension,
                }
                data[params.dimension] = $state.params.id
                var url = $state.href('pano.market.default', data)
                window.open(url, '_blank')
            }

            $scope.datepickerSettings = {
                // startOfWeek: 'monday',
                applyBtnClass: 'btn btn-navy-blue btn-xs',
                // batchMode: 'week-range',
                singleMonth: false,
                extraClass: 'date-picker-pano-top',
                showWeekNumbers: false,
                autoClose: false,
                beforeShowDay: function(t) {
                    var m = moment()
                    var valid = t <= (m.day() ? m.day(0).add(1, 'w').toDate() : m.toDate()) && t >= moment('2016-03-01').toDate() //  当周以后不可选
                    var _class = '';
                    var _tooltip = valid ? '' : '不在可选范围内';
                    return [valid, _class, _tooltip];
                },
                showShortcuts: true,
                customShortcuts: [{
                    name: '最近4周',
                    dates: function() {
                        var end = moment().day(0).add(+(moment().day() > 0), 'w').toDate();
                        var start = moment(end).subtract(4, 'w').add(1, 'd').toDate();
                        return [start, end];
                    }
                }, {
                    name: '最近6周',
                    dates: function() {
                        var end = moment().day(0).add(+(moment().day() > 0), 'w').toDate();
                        var start = moment(end).subtract(6, 'w').add(1, 'd').toDate();
                        return [start, end];
                    }
                }, {
                    name: '最近8周',
                    dates: function() {
                        var end = moment().day(0).add(+(moment().day() > 0), 'w').toDate();
                        var start = moment(end).subtract(8, 'w').add(1, 'd').toDate();
                        return [start, end];
                    }
                }]
            }

            $scope.datePicker = params.start_at + '~' + params.end_at
            $scope.$watch('datePicker', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var dates = newValue.split('~')
                    var data = {
                        start_at: dates[0],
                        end_at: dates[1]
                    }
                    weekAmountChart.updateDataView(data)
                    weekRateChart.updateDataView(data)
                    assetTypePercentChart.updateDataView(data)
                }
            })

            var shortDatePeriod = function(xAxis) { //横轴显示简略的格式
                return _.map(xAxis, function(x) {
                    return moment(x).format('MMDD~') + moment(x).weekday(6).format('MMDD')
                })
            }

            var rightGap = 40 // 图表主体距离右边距离
            var leftGap = 65
            var topGap = 50
            var bottomGap = 80
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
                    left: 'center',
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

            // 产品发行量趋势
            var weekAmountChart = $scope.weekAmountChart = {
                chartOptions: {},
                _params: {},
                // xAxis: params.dimension,
                yAxisFormat: 'rmb',
                yAxis: 'amount',
                xAxisFormat: null,
                list: []
            }
            weekAmountChart.updateDataView = function(paramObj) {
                var _self = this
                $.extend(_self._params, paramObj || {})
                _self.echart = echarts.getInstanceByDom($('#weekAmountChart')[0])

                if (_self.echart) {
                    _self.echart.hideLoading()
                    _self.echart.showLoading(loadingSettings)
                }

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

                    var caculateOptions = ktDataHelper.chartOptions('#weekAmountChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        legend: {
                            data: legend,
                        },
                        tooltip: {
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
                            name: '发行量（单位：万元）',
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

            // 产品收益率趋势
            var weekRateChart = $scope.weekRateChart = {
                chartOptions: {},
                // xAxis: params.dimension,
                yAxisFormat: 'percent2', //percent2 意思不需要*100
                yAxis: 'rate',
                _filters: [{
                    name: '期限：',
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
            weekRateChart.updateDataView = function(paramObj) {
                var _self = this
                $.extend(_self._params, paramObj || {})
                _self.echart = echarts.getInstanceByDom($('#weekRateChart')[0])

                if (_self.echart) {
                    _self.echart.hideLoading()
                    _self.echart.showLoading(loadingSettings)
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
                    var chart = _self.echart = echarts.getInstanceByDom($('#weekRateChart')[0])

                    var caculateOptions = ktDataHelper.chartOptions('#weekRateChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        legend: {
                            data: legend,
                        },
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
                            name: '收益率（单位：%）',
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

            // 资产类型占比饼图
            var assetTypePercentChart = $scope.assetTypePercentChart = {
                chartOptions: {},
                _params: {},
                // xAxis: params.dimension,
                yAxisFormat: 'percent2',
                yAxis: 'rate',
                xAxisFormat: null,
                list: []
            }
            assetTypePercentChart.updateDataView = function(paramObj) {
                var _self = this
                $.extend(_self._params, paramObj || {})
                _self.echart = echarts.getInstanceByDom($('#assetTypePercentChart')[0])

                if (_self.echart) {
                    _self.echart.hideLoading()
                    _self.echart.showLoading(loadingSettings)
                }

                ktAnalyticsService.get(ktDataHelper.cutDirtyParams($.extend(true, {}, params, {
                    content: 'overview',
                    chart: 'circulation_pct',
                }, _self._params)), function(data) {
                    _self.data = ktDataHelper.chartDataToPercent(data.stat)
                    _self.data = _.chain(_self.data.data).map(function(v) {
                        return {
                            name: v.name,
                            value: v.data[0] || 0
                        }
                    }).value()

                    updateView()
                })

                function updateView() {
                    var data = _self.data
                    var legend = _.map(data, 'name')
                    var chart = _self.echart = echarts.getInstanceByDom($('#assetTypePercentChart')[0])

                    var caculateOptions = ktDataHelper.chartOptions('#assetTypePercentChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        legend: {
                            data: legend,
                        },
                        tooltip: {
                            trigger: 'item',
                            axisPointer: {
                                axis: 'auto',
                                type: 'line',
                            },
                            formatter: function(serie) {
                                var res = '<div class="f1_2rem chart-tooltip-title" style="border-bottom: 1px solid rgba(255,255,255,.3);padding-bottom: 5px;margin-bottom:5px;">' +
                                    serie.data.name + '</div><table class="f1_2rem chart-tooltip-table">' +
                                    '<tr><td class="justify">占比：</td><td>' + ktValueFactory(serie.data.value, _self.yAxisFormat) + '</td></tr>';
                                return res;
                            },
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: {
                            show: false,
                        },
                        xAxis: {
                            show: false,
                        },
                        grid: {
                            show: true,
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 50
                        },
                        series: [{
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    })

                    /*eslint-disable*/
                    chart && chart.hideLoading()
                        /*eslint-enable*/
                }
            }

            /*----------------------------------tab分割线-----------------------------------*/
            //添加不同的参数
            function amendSpecialParams(data) {
                if (params.dimension === 'from') {
                    data.from_eq = params.from
                } else if (params.dimension === 'mapped_exchange') {
                    data.exchange_eq = params.mapped_exchange
                }
            }

            $scope.moreTableView = function(type) {
                var data = {}
                amendSpecialParams(data)
                var url = $state.href('pano.products.' + type, data)
                window.open(url, '_blank')
            }

            var assetParams = {
                page: 1,
                per_page: 10
            }
            amendSpecialParams(assetParams)

            // 产品信息-资产类
            function getBondList() {
                ktCompassAssetService.get($.extend({
                    credit_right_or_eq: 'bond'
                }, assetParams), function(res) {
                    $scope.products = res.compass_assets
                })
            }

            // 产品信息-资管类
            function getAmList() {
                ktCompassAssetService.get($.extend({
                    credit_right_or_eq: 'am'
                }, assetParams), function(res) {
                    $scope.products2 = res.compass_assets
                })
            }

            $scope.inst = {}
            $scope.moduleVisible = function(moduleName) {
                return $scope.inst && _.includes($scope.inst.tab, moduleName)
            }

            // 机构基本信息
            ktInsitutionsService.get({
                instID: $state.params.id
            }, function(data) {
                var inst = $scope.inst = data.institution
                    // inst.assets = inst.assets.split(/[,，]/g)
                    // ktDataHelper.listOneLineFilter(inst.assets, '.init-main-info', 260, 13, 10, 3)
                if (!inst) return

                inst.descObj = ktDataHelper.textEllipsis(inst.desc, '.init-main-info .desc', 0, 13, 4, 6)
                inst.assetsObj = ktDataHelper.textEllipsis(inst.assets, '.init-main-info', 260, 13, 3, 1)

                if ($scope.moduleVisible('chart')) {
                    weekAmountChart.updateDataView()
                    weekRateChart.updateDataView()
                    assetTypePercentChart.updateDataView()
                } else {
                    $scope.tabActive.tab1 = false
                    $scope.tabActive.tab2 = true
                }

                if ($scope.moduleVisible('am')) getAmList()
                if ($scope.moduleVisible('bond')) getBondList()

            })

        })
})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOverviewCtrl', function($scope, $rootScope, $q, $state, $templateRequest, $window, $stateParams, ktDataHelper, ktAnalyticsService, ktValueFactory, ktEchartTheme1, ktSweetAlert, ktLogService, ktInstitutionalInfoService, ktNewProductService, ktProductRateService) {

            $scope.updateDate = '获取中...'
            $scope.updateDateTo = '获取中...'
            $scope.getLife = ktDataHelper.getLife
            $scope.updateTime = '更新时间：'
            $scope.timeRange = '时间范围：'
                /*$scope.dynamicPopover = {
                    templateUrl: 'views/tooltips/popover.html',
                    title: '提示'
                }

                $scope.popoverConfirm = function() {
                    $rootScope.show2016Report = false
                }*/
            $scope.findPopover = {
                templateUrl: 'views/tooltips/find_popover.html',
                title: '提示'
            }
            $scope.showFindPopover = $rootScope.showFindPopover
            $scope.findPopoverConfirm = function() {
                $scope.showFindPopover = false
                $rootScope.showFindPopover = false

            }

            $scope.goTo = function($event, url) {
                $event.stopPropagation()
                window.open(url, '_blank')
            }

            // 用户浏览更多的权限
            $scope.moreHidden = function() {
                var user = $rootScope.user || {}
                return user.group !== 'normal'
            }

            // 年化收益率
            $scope.getRate = function(dr, hr) {
                if (_.isNil(dr) && _.isNil(hr)) {
                    return '-'
                } else if (_.isNil(dr) && !_.isNil(hr)) {
                    return hr.toFixed(2) + '%'
                } else if (_.isNil(hr) && !_.isNil(dr)) {
                    return dr.toFixed(2) + '%'
                } else if (dr === hr) {
                    return dr.toFixed(2) + '%'
                }

                return dr.toFixed(2) + '%' + '-' + hr.toFixed(2) + '%'
            }

            var colors = ktEchartTheme1.color
            var loadingSettings = { // 设置图表异步加载的样式
                text: '努力加载中...',
                color: '#3d4351',
                textColor: '#3d4351',
            }

            /*    <!-- 给设计师调色用 上线注释掉 --> */
            /*$scope.tmplColor = ''
            $scope.$watch('tmplColor', function(newValue) {
                var color = _.map(newValue.split(','), _.trim)
                if (!color.length) return
                echarts.getInstanceByDom($('#platformAssetTypeChart')[0]).setOption({
                    color: color
                })
            });*/

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

            // 各平台发行量-收益率统计图
            var rateAmountChart = $scope.rateAmountChart = {
                chartOptions: {},
                yAxis: 'amount',
                yAxisFormat: 'rmb',
                xAxis: 'rate',
                xAxisFormat: 'percent2',
                color: ['#dd4444'],
                tab: 'last7days',
                list: []
            }
            rateAmountChart.updateDataView = function(options, silent) {
                var _self = this
                var chart = _self.echart = echarts.getInstanceByDom($('#rateAmountChart')[0])
                if (silent) {
                    if (chart) {
                        chart.hideLoading()
                        chart.showLoading(loadingSettings)
                    }
                }

                ktAnalyticsService.get($.extend({
                    content: 'overview',
                    chart: 'summary',
                }, options || {}), function(data) {
                    _self.data = ktDataHelper.sortByChars(data.stat)
                    if (data.crawled_at) {
                        $scope.updateDate = moment(data.crawled_at).subtract(6, 'd').format('YYYY-MM-DD') + ' ~ ' + moment(data.crawled_at).format('YYYY-MM-DD')
                        $scope.updateDateTo = moment(data.crawled_at).format('YYYY-MM-DD')
                    }
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

                    // 气泡大小
                    var sizeFunction = function(x) {
                        var y = Math.min(Math.sqrt(x / 5e8) + 0.1, 2.5)
                        y = Math.max(0.25, y)
                        return y * 25
                    }
                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                            // color: _self.color,
                            onclick: function(e) {
                                var url = $state.href('pano.institutions.detail', {
                                    id: e.seriesName,
                                })
                                window.open(url, '_blank');
                            },
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
                                        '<tr><td class="justify">发行量：</td><td>' + ktValueFactory(params.value[1], _self.yAxisFormat) + '</td></tr>';
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
                                        symbolSize: [5, 50]
                                    },
                                    outOfRange: {
                                        symbolSize: [5, 50],
                                        color: ['rgba(0,0,0,.2)']
                                    }
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
                                name: '发行量（万元）',
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
                                max: (function() {
                                    var max = _.max(xAxisArr)
                                    var decimal = _.round(max - (max | 0), 2)
                                    return _.ceil(max) + 1 * (decimal > 0.8)
                                })(),
                                min: (function() {
                                    var min = _.min(xAxisArr)
                                    var decimal = _.round(min - (min | 0), 2)
                                    return _.floor(min) - 1 * (decimal < 0.3)
                                })(),
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
                                    itemStyle: {
                                        normal: {
                                            opacity: 0.7,
                                        }
                                    },
                                    type: 'effectScatter',
                                    symbolSize: function(val) {
                                        return sizeFunction(val[1])
                                    },
                                    rippleEffect: {
                                        period: 8,
                                        scale: 1.5,
                                        brushType: 'fill'
                                    },
                                    data: [v]
                                }
                            })
                        })
                        /*eslint-disable*/
                    chart && chart.hideLoading()
                        /*eslint-enable*/
                }
            }

            $scope.$watch('rateAmountChart.tab', function(newValue, oldValue) {
                if (_.isUndefined(newValue) || newValue === oldValue) return
                rateAmountChart.updateDataView({
                    chart: newValue === 'last7days' ? 'summary' : 'history' // to be defined
                }, true)
                $rootScope.bdTrack(['总览页', newValue === 'last7days' ? '近七日' : '历史平均周', '各平台发行量收益率统计'])
            })

            //弹出了解更多二维码
            $scope.alertMore = function() {
                    $rootScope.bdTrack(['总览页', '交易所产品发行登记管理核心系统', '详情'])
                    ktSweetAlert.swal({ // 不要在html模式下使用h2和p标签，回导致sweetalert的bug
                        title: '<h4 class="title-more">详情' + '</h4>' + '<div class="more-table"><table><tbody><tr><td><span>多种产品全支持</span></td><td><span>产品发行自动化</span></td><td><span>合规发行支持 </span></td></tr>' + '<tr><td><span>产品信息多维展示 </span></td><td><span>事件智能提醒</span></td><td><span>权限/审批灵活可配 </span></td></tr></tbody></table></div>' + '<p class="alert-moreCode">' + '如果想了解更多信息，欢迎与我们联系：)' + '</p>',
                        text: '<span class="moreCode-pano">' + '<img src="../../images/moreCode.png">' + '</span>',
                        html: true
                            // showCloseButton: true
                            // showCancelButton: true
                    })
                }
                //记录买点
            $scope.bdRecord = function(name) {
                    ktLogService.get({
                        anchor: 'action=总览页-下载-' + name
                    })
                    bdTrack(['总览页', '下载', name])
                }
                // 期限利率图 @deprecated 用下面组合图替代
                /*var durationRateChart = $scope.durationRateChart = {
                    chartOptions: {},
                    yAxis: 'rate',
                    yAxisFormat: 'percent2',
                    xAxis: '_id',
                    color: ['#6596e0', '#ffa500'],
                    xAxisFormat: null,
                    list: []
                }
                durationRateChart.updateDataView = function() {
                    var _self = this

                    ktAnalyticsService.get({
                        content: 'overview',
                        chart: 'rate',
                    }, function(data) {
                        _self.data = ktDataHelper.chartDataPrune(data.stat)
                        updateView()
                    })

                    function updateView() {
                        var data = _self.data
                        var legend = _.map(data.data, 'name')
                        var caculateOptions = ktDataHelper.chartOptions('#durationRateChart', legend)
                            // var color = _self.color

                        _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                            legend: {
                                data: legend
                            },
                            tooltip: {
                                axisPointer: {
                                    axis: 'auto',
                                    type: 'line',
                                },
                                // color: color,
                                xAxisFormat: _self.xAxisFormat,
                                titlePrefix: '产品期限：',
                                yAxisFormat: _self.yAxisFormat //自定义属性，tooltip标示，决定是否显示百分比数值
                            },
                            yAxis: {
                                name: '收益率（%）',
                                interval: 1,
                                max: ktDataHelper.getAxisMax(data.data),
                                min: 0
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
                                    // color: '#ffa500',
                                    // lineStyle: {
                                    //     normal: { color: color[i] },
                                    // },
                                    // itemStyle: {
                                    //     normal: { color: color[i] },
                                    // },
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
                }*/

            // 不同期限产品发行量-收益率统计图
            var durationAmountChart = $scope.durationAmountChart = {
                chartOptions: {},
                yAxis: 'amount',
                yAxisFormat: 'rmb',
                yAxisFormat2: 'percent2',
                xAxis: '_id',
                xAxisFormat: null,
                list: []
            }
            durationAmountChart.updateDataView = function() {
                var _self = this
                var circulationPromise = ktAnalyticsService.get({
                    content: 'overview',
                    chart: 'circulation',
                }).$promise
                var ratePromise = ktAnalyticsService.get({
                    content: 'overview',
                    chart: 'rate',
                }).$promise

                $q.all([circulationPromise, ratePromise]).then(function(data) {
                    _self.data1 = ktDataHelper.chartDataPrune(data[0].stat)
                    _self.data2 = ktDataHelper.chartDataPrune(data[1].stat)
                    _.each(_self.data1.data, function(v) {
                        var m1 = v.name.match(/上周期（(.*)）/)
                        var m2 = v.name.match(/本周期（(.*)）/)

                        _self.lastPeriod = (m1 ? '上周期：' + m1[1] : _self.lastPeriod)
                        _self.thisPeriod = (m2 ? '本周期：' + m2[1] : _self.thisPeriod)
                    })

                    _self.data1.data = _.map(_self.data1.data, function(v) {
                        return { name: v.name.replace(/周期（.+）/g, '周期发行量'), data: v.data }
                    })
                    _self.data2.data = _.map(_self.data2.data, function(v) {
                        return { name: v.name.replace(/周期（.+）/g, '周期收益率'), data: v.data }
                    })

                    updateView()
                })

                function updateView() {
                    var data1 = _self.data1
                    var data2 = _self.data2
                    var legend = _.concat(_.map(data1.data, 'name'), _.map(data2.data, 'name'))
                    var color = _.concat(colors.slice(0, 2), colors.slice(0, 2))
                    var caculateOptions = ktDataHelper.chartOptions('#durationAmountChart', legend)

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        color: color,
                        legend: {
                            data: legend
                        },
                        tooltip: {
                            titlePrefix: '产品期限：',
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat + '{0,1}|' + _self.yAxisFormat2 + '{2,3}', //自定义属性，tooltip标示，决定是否显示百分比数值
                        },
                        yAxis: [{
                            name: '发行量（万元）',
                            textStyle: {
                                color: '#666b76',
                                fontSize: 10
                            },
                            axisLabel: {
                                formatter: function(value) {
                                    var yAxisFormat = durationAmountChart.yAxisFormat
                                    return ktValueFactory(value, yAxisFormat).toString().replace(/%|万元|百万|元/g, '')
                                }
                            }
                        }, {
                            name: '收益率（%）',
                            textStyle: {
                                color: '#666b76',
                                fontSize: 10
                            },
                            position: 'right',
                            axisLabel: {
                                formatter: function(value) {
                                    var yAxisFormat = durationAmountChart.yAxisFormat2
                                    return ktValueFactory(value, yAxisFormat).toString().replace(/%|万元|百万|元/g, '')
                                }
                            },
                            interval: 1,
                            max: ktDataHelper.getAxisMax(data2.data),
                            min: 0
                        }],
                        xAxis: {
                            type: 'category',
                            boundaryGap: true,
                            axisLabel: {
                                formatter: function(value) {
                                    var xAxisFormat = durationAmountChart.xAxisFormat
                                    return ktValueFactory(value, xAxisFormat)
                                }
                            },
                            // name: '期限',
                            nameLocation: 'end',
                            nameGap: 10,
                            data: ktDataHelper.chartAxisFormat(data1.xAxis, 'MY')
                        },
                        // series: _.map(data1.data, function(v) {
                        //     return {
                        //         name: v.name,
                        //         type: 'bar',
                        //         itemStyle: {
                        //             normal: {
                        //                 opacity: 0.8
                        //             }
                        //         },
                        //         barMaxWidth: 40,
                        //         data: v.data
                        //     }
                        // })
                        series: _.concat(_.map(data1.data, function(v) {
                            return {
                                name: v.name,
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        opacity: 0.8
                                    }
                                },
                                barMaxWidth: 40,
                                data: v.data
                            }
                        }), _.map(data2.data, function(v) {
                            return {
                                name: v.name,
                                type: 'line',
                                yAxisIndex: 1,
                                /*itemStyle: {
                                    normal: {
                                        color: colors[i]
                                    }
                                },*/
                                markLine: {
                                    data: ktDataHelper.getMarkLineCoords(v.data)
                                },
                                smooth: false,
                                data: v.data
                            }
                        }))
                    })
                }
            }

            // 不同资产类型产品发行量-收益率统计图
            var platformAssetTypeChart = $scope.platformAssetTypeChart = {
                chartOptions: {},
                yAxis: 'amount',
                updateDate: '获取中...',
                yAxisFormat: 'percent2',
                xAxis: '_id',
                color: ktDataHelper.getDimentionSpecialColor('asset_type'),
                xAxisFormat: null,
                list: []
            }
            platformAssetTypeChart.updateDataView = function() {
                var _self = this
                ktAnalyticsService.get({
                    content: 'overview',
                    chart: 'circulation_ratio',
                }, function(data) {
                    _self.data = ktDataHelper.chartDataToPercent(data.stat, 'amount')
                    updateView()
                })

                function updateView() {
                    var data = _self.data
                    var legend = _.map(data.data, 'name')
                    var caculateOptions = ktDataHelper.chartOptions('#platformAssetTypeChart', legend)
                    var color = _self.color || colors.slice(0, legend.length)
                    _self.updateDate = _.first(data.xAxis) + ' ~ ' + moment(_.last(data.xAxis)).weekday(6).format('YYYY-MM-DD')

                    var echartTooltip //用于echart的tooltip显示
                    $templateRequest('views/tooltips/echart_table_tooltip.html').then(function(tpl) {
                        echartTooltip = _.template(tpl, { imports: { ktValueFactory: ktValueFactory } })
                    })

                    _self.chartOptions = $.extend(true, {}, chartOptions, caculateOptions, {
                        color: _.reverse(color.slice(0)),
                        legend: {
                            data: legend
                        },
                        tooltip: {
                            reverse: true,
                            xAxisFormat: _self.xAxisFormat,
                            yAxisFormat: _self.yAxisFormat, //自定义属性，tooltip标示，决定是否显示百分比数值
                            formatter: function(p) {
                                if (!echartTooltip) return '';
                                var params = _.reverse(p)
                                var title = params[0].name
                                title += ' ~ ' + moment(title).weekday(6).format('YYYY-MM-DD')
                                _.each(params, function(v) {
                                    v.amount = data.data[v.seriesIndex].amount[v.dataIndex]
                                    v.rate = data.data[v.seriesIndex].rate[v.dataIndex]
                                })

                                var res = echartTooltip({
                                    title: title,
                                    params: params,
                                    color: _.reverse(color.slice(0))
                                })
                                return res
                            }
                        },
                        yAxis: {
                            name: '类型占比（%）',
                            max: 100,
                            min: 0
                        },
                        xAxis: {
                            type: 'category',
                            name: '周',
                            nameLocation: 'end',
                            nameGap: 10,
                            axisLabel: {
                                interval: 'auto'
                            },
                            boundaryGap: true,
                            data: data.xAxis
                        },

                        series: _.map(_.reverse(data.data), function(v) {
                            return {
                                name: v.name,
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        opacity: 0.8
                                    }
                                },
                                stack: '类型占比',
                                barMaxWidth: 40,
                                data: v.amount_percent
                            }
                        })
                    })
                }
            }

            // 初始加载数据
            rateAmountChart.updateDataView()
                // durationRateChart.updateDataView()
            durationAmountChart.updateDataView()
            platformAssetTypeChart.updateDataView()

            /*-----------------------右边栏------------------------*/

            // 侧栏和推荐产品
            var pageSize = $scope.pageSize = 10 // 10条一页

            $scope.nextFromPage = function() {
                if ($scope.from_page < $scope.max_from_page) {
                    $scope.from_page += 1
                    $rootScope.bdTrack(['总览页', '翻页', '平台近7日发行量'])
                }
            }
            $scope.preFromPage = function() {
                if ($scope.from_page > 0) {
                    $scope.from_page -= 1
                    $rootScope.bdTrack(['总览页', '翻页', '平台近7日发行量'])
                }
            }

            $scope.nextExchangePage = function() {
                if ($scope.exchange_page < $scope.max_exchange_page) {
                    $scope.exchange_page += 1
                    $rootScope.bdTrack(['总览页', '翻页', '交易所近7日发行量'])
                }
            }
            $scope.preExchangePage = function() {
                if ($scope.exchange_page > 0) {
                    $scope.exchange_page -= 1
                    $rootScope.bdTrack(['总览页', '翻页', '交易所近7日发行量'])
                }
            }

            $scope.from_page = 0
            $scope.exchange_page = 0
            $scope.max_from_page = 0
            $scope.max_exchange_page = 0

            $scope.fromAmountsFilter = function(value, index) {
                return index >= $scope.from_page * pageSize && index < $scope.from_page * pageSize + pageSize
            }
            $scope.exchangeAmountsFilter = function(value, index) {
                return index >= $scope.exchange_page * pageSize && index < $scope.exchange_page * pageSize + pageSize
            }

            //右边栏金融平台，企业借款，小微金融类
            ktInstitutionalInfoService.get({}, function(data) {
                $scope.amounts = data.platform
                if (data.platform.all_amount.length > 0) {
                    $scope.all_amounts = data.platform.business_borrowings.slice(0, 5)
                }
            })

            $scope.topAmounts = []
            $scope.topPercents = []
            $scope.ams = []

            //总览页 最新产品信息
            ktNewProductService.get({ bond_or_am: 'bond' }, function(data) {
                $scope.upDateBond = data.res.updated_at
                $scope.topAmounts = data.res.top_amount_res
                $scope.topPercents = data.res.top_percent_res
            })

            ktNewProductService.get({ bond_or_am: 'am' }, function(data) {
                $scope.upDateAm = data.res.updated_at
                if (data.res.am_res.length > 0) {
                    $scope.ams = data.res.am_res.slice(0, 5)
                }
            })

            $scope.newProductUpdateTime = function() {
                if ($scope.topAmounts.length || $scope.topPercents.length) {
                    if ($scope.ams.length) {
                        if (+new Date($scope.upDateBond) > +new Date($scope.upDateAm)) {
                            return $scope.upDateBond
                        }
                        return $scope.upDateAm
                    }
                    return $scope.upDateBond
                }
                return $scope.upDateAm || '-'
            }

            //各产品收益率表
            ktProductRateService.get({ type: 'bond' }, function(data) {
                $scope.rateDatas = data.res
                $scope.rateThTitles = _.map(data.res.list[0].set, 'group')
                $scope.obRateTime = data.res.begin_date + '至' + data.res.end_date
                var dpr = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || window.msDevicePixelRatio
                setTimeout(function() {
                    var obRateTable = $('#obRateTable')
                    var w = obRateTable.width()
                    var h = obRateTable.height()
                    var canvas = document.createElement('canvas')
                    canvas.width = w * dpr
                    canvas.height = h * dpr
                    canvas.style.width = w + 'px'
                    canvas.style.height = h + 'px'
                    var context = canvas.getContext('2d')
                    if (dpr > 1) {
                        context.scale(2, 2)
                    }
                    html2canvas(obRateTable[0], {
                        // canvas: canvas,
                        onrendered: function(cav) {
                            obRateTable.append(cav)
                        }
                    })
                }, 1000)
            })
            ktProductRateService.get({ type: 'am' }, function(data) {
                $scope.assetDatas = data.res
                $scope.asserRateTime = data.res.begin_date + '至' + data.res.end_date
                $scope.assetThTitles = _.map(data.res.list[0].set, 'group')
                var dpr = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || window.msDevicePixelRatio

                setTimeout(function() {
                    var assetRateTable = $('#assetRateTable')
                    var w = assetRateTable.width()
                    var h = assetRateTable.height()
                    var canvas = document.createElement('canvas')
                    canvas.width = w * dpr
                    canvas.height = h * dpr
                    canvas.style.width = w + 'px'
                    canvas.style.height = h + 'px'
                    var context = canvas.getContext('2d')
                    if (dpr > 1) {
                        context.scale(2, 2)
                    }
                    html2canvas(assetRateTable[0], {
                        // canvas: canvas,
                        onrendered: function(cav) {
                            assetRateTable.append(cav)
                        }
                    })
                }, 1000)
            })
            ktAnalyticsService.get({
                content: 'hodgepodge',
            }, function(data) {
                $scope.notices = data.notices
                $scope.from_amounts = _.map(data.froms, function(v) {
                    return {
                        name: v[0],
                        amount: v[1]
                    }
                })
                $scope.max_from_page = Math.ceil(data.froms.length / pageSize) - 1

                $scope.exchange_amounts = _.map(data.exchanges, function(v) {
                    return {
                        name: v[0],
                        amount: v[1]
                    }
                })
                $scope.max_exchange_page = Math.ceil(data.exchanges.length / pageSize) - 1

                $scope.reports = data.reports
                $scope.compass_assets_am = data.compass_ams
                $scope.compass_assets_bond = data.compass_bonds
                $scope.fame_assets_am = data.fame_ams
                $scope.fame_assets_bond = data.fame_bonds
            })
        })
})();

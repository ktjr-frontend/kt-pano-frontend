;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktAssetManageCtrl', function($scope, $location, $stateParams, $rootScope, ktProductsService, ktProductTrendsService, ktDataHelper, ktSweetAlert) {
        var search = $location.search()
        var params = $scope.params = $.extend({}, search)

        ktProductsService.get({ content: $stateParams.id }, function(data) {
            $scope.productManage = data.products
            var inst = $scope.inst = data.from_info

            if (inst) inst.descObj = ktDataHelper.textEllipsis(inst.from_introduce, '.init-main-info .desc', 0, 14, 4, 6)
            $scope.similars = data.similar_products

            //收益率
            function groupData(arr) {
                if (!_.isArray(arr)) return
                if (arr.length % 3 !== 0) {
                    arr.push({
                        empty: true
                    })
                    groupData(arr)

                } else {
                    $scope.termRates = arr
                }
            }
            groupData(data.products.partitions)

            //相似产品
            function group(arr) {
                if (arr.length % 3 !== 0) {
                    arr.push({
                        empty: true
                    })
                    group(arr)

                } else {
                    $scope.similars = arr
                }
            }
            group(data.similar_products)

            //日期选择
            params.begin_date = moment(Math.max(moment(data.products.begin_date).toDate(), moment(data.products.last_date).subtract(30, 'days').toDate())).format('YYYY-MM-DD')
            params.end_date = moment(data.products.last_date).format('YYYY-MM-DD')
            $scope.datePicker = params.begin_date + '~' + params.end_date

            $scope.$watch('datePicker', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var dates = newValue.split('~')
                    var opt = {
                        begin_date: dates[0],
                        end_date: dates[1]

                    }

                    // 加载图表数据
                    productRateTrend.updateDataView(opt)
                }
            })
            productRateTrend.updateDataView()

            // 各期限收益率情况
            var durationRateChart = $scope.durationRateChart = {
                chartOptions: {},
                _params: {},
                // xAxis: params.dimension,
                yAxisFormat: 'percent2',
                yAxis: 'rate',
                xAxisFormat: null,
                list: []
            }

            $scope.durationRateChart.chartOptions = $.extend(true, {}, chartOptions, {
                legend: {
                    data: ['各期限收益率']
                },
                tooltip: {
                    axisPointer: {
                        axis: 'auto',
                        type: 'line',
                    },
                    xAxisFormat: durationRateChart.xAxisFormat,
                    yAxisFormat: durationRateChart.yAxisFormat, //自定义属性，tooltip标示，决定是否显示百分比数值还是人民币
                    // reverse: true,
                },
                yAxis: {
                    name: '收益率（%）'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: _.map(data.products.partitions, 'life')
                },
                series: [{
                    name: '各期限收益率',
                    itemStyle: {
                        normal: {
                            opacity: 0.8,
                        },
                        emphasis: {
                            barBorderWidth: 1,
                            barBorderColor: 'rgba(0,0,0,.5)'
                        }
                    },
                    type: 'line',
                    step: 'end',
                    smooth: false,
                    data: _.map(data.products.partitions, 'rate')
                }]
            })

        })

        // 产品收益率趋势
        var productRateTrend = $scope.productRateTrend = {
            chartOptions: {},
            _params: {},
            // xAxis: params.dimension,
            yAxisFormat: 'percent2',
            yAxis: 'rate',
            xAxisFormat: null,
            list: []
        }

        var rightGap = 15 // 图表主体距离右边距离
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
                // show: false,
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
                var valid = t <= m.toDate() && t >= moment('2016-03-01').toDate() //  当周以后不可选
                var _class = '';
                var _tooltip = valid ? '' : '不在可选范围内';
                return [valid, _class, _tooltip];
            }
        }

        productRateTrend.updateDataView = function(paramObj) {
            var _self = this
            $.extend(_self._params, paramObj || {})
            _self.echart = echarts.getInstanceByDom($('#productRateTrend')[0])

            if (_self.echart) {
                _self.echart.hideLoading()
                _self.echart.showLoading(loadingSettings)
            }

            ktProductTrendsService.get(ktDataHelper.cutDirtyParams($.extend(true, {}, params, {
                id: $stateParams.id,
            }, _self._params)), function(data) {
                _self.data = data.rates
                updateView()
            })

            function updateView() {
                var chart = _self.echart = echarts.getInstanceByDom($('#productRateTrend')[0])

                _self.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: ['收益率趋势']
                    },
                    tooltip: {
                        axisPointer: {
                            axis: 'auto',
                            type: 'line',
                        },
                        xAxisFormat: _self.xAxisFormat,
                        yAxisFormat: _self.yAxisFormat, //自定义属性，tooltip标示，决定是否显示百分比数值还是人民币
                        // reverse: true,
                    },
                    yAxis: {
                        name: '收益率（%）'
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: _.map(_self.data, 'date')
                    },
                    series: [{
                        name: '收益率趋势',
                        itemStyle: {
                            normal: {
                                opacity: 0.8,
                            },
                            emphasis: {
                                barBorderWidth: 1,
                                barBorderColor: 'rgba(0,0,0,.5)'
                            }
                        },
                        smooth: false,
                        type: 'line',
                        data: _.map(_self.data, 'rate')
                    }]
                })

                /*eslint-disable*/
                chart && chart.hideLoading()
                    /*eslint-enable*/
            }
        }

        //弹出pano酱二维码
        $scope.alertCode = function() {
            ktSweetAlert.swal({
                title: '<p class="alert">' + '更多产品数据，请联系微信客服PANO酱' + '</p>',
                text: '<div class="img-pano">' + '<img src="images/pano_wxSEC.png">' + '</div>',
                html: true,
                showCloseButton: true
                    // showCancelButton: true
            })
        }
    })
})();

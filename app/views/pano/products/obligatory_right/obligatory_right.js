;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktAssetsCtrl', function($scope, $location, $timeout, $stateParams, $rootScope, ktProductsService, ktDataHelper, ktProductTrendsService, ktSweetAlert) {

        $scope.$on('$stateChangeSuccess', function() {
            // 切换页面成功后回到顶部
            $timeout(function() {
                $('body').scrollTop(0)
            }, 100)
        })

        var search = $location.search()
        var params = $scope.params = $.extend({}, search)

        ktProductsService.get({ content: $stateParams.id }, function(data) {
            $scope.assetsDatas = data.products
            $scope.updateTime = data.products.latest_uptime
            $scope.original_products = data.original_products
            $scope.listing = data.exchange_info
            //发行平台
            var inst = $scope.inst = data.from_info
            if (inst) {
                $timeout(function() {
                    inst.descObj = ktDataHelper.textEllipsis(inst.from_introduce, '.init-main-info .desc', 0, 14, 4, 6)
                }, 100)
            }

            //挂牌场所
            var exchange = $scope.exchange = data.exchange_info
            if (exchange) {
                $timeout(function() {
                    exchange.exchangeObj = ktDataHelper.textEllipsis(exchange.exchange_introduce, '.init-main-info .desc', 0, 14, 4, 1)
                }, 100)
            }

            //收益率情况
            function groupData(arr) {
                if (arr.length % 3 !== 0) {
                    arr.push({
                        empty: true
                    })
                    groupData(arr)

                } else {
                    $scope.partitions = arr
                }
            }
            groupData(data.products.partitions || [])

            // $scope.similars = data.similar_products
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
                    dailyRaiseChart.updateDataView(opt)
                }
            })

            /*$scope.datepickerSettings = {
                // startOfWeek: 'monday',
                applyBtnClass: 'btn btn-navy-blue btn-xs',
                // batchMode: 'week-range',
                singleMonth: false,
                extraClass: 'date-picker-pano-top',
                showWeekNumbers: false,
                autoClose: false,
                beforeShowDay: function(t) {
                    var valid = t <= moment(params.end_date).toDate() && t >= moment(params.start_date).toDate() //  当周以后不可选
                    var _class = '';
                    var _tooltip = valid ? '' : '不在可选范围内';
                    return [valid, _class, _tooltip];
                }
            }*/

            // 加载图表数据
            dailyRaiseChart.updateDataView()

        })

        //弹出pano酱二维码
        $scope.alertCode = function() {
            ktSweetAlert.swal({ // 不要在html模式下使用h2和p标签，回导致sweetalert的bug
                title: '<h3 class="title-code">全部数据' + '</h3>' + '<span class="alert-text">' + '如想获得更多数据，请联系PANO微信小助手' + '</span>',
                text: '<span class="img-pano">' + '<img src="images/pano_wxSEC.png">' + '</span>',
                html: true
                // showCloseButton: true
                    // showCancelButton: true
            })
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

        // 日募集情况
        var dailyRaiseChart = $scope.dailyRaiseChart = {
            chartOptions: {},
            _params: {},
            // xAxis: params.dimension,
            yAxisFormat: 'rmb',
            yAxis: 'amount',
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

        dailyRaiseChart.updateDataView = function(paramObj) {
            var _self = this
            $.extend(_self._params, paramObj || {})
            _self.echart = echarts.getInstanceByDom($('#dailyRaiseChart')[0])

            if (_self.echart) {
                _self.echart.hideLoading()
                _self.echart.showLoading(loadingSettings)
            }

            ktProductTrendsService.get(ktDataHelper.cutDirtyParams($.extend(true, {}, params, {
                id: $stateParams.id,
            }, _self._params)), function(data) {
                _self.data = data.products
                $scope.avg_amount = data.avg_amount
                $scope.max_amount = data.max_amount
                $scope.min_amount = data.min_amount
                updateView()
            })

            function updateView() {
                var chart = _self.echart = echarts.getInstanceByDom($('#dailyRaiseChart')[0])

                _self.chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: ['日募集情况']
                    },
                    tooltip: {
                        xAxisFormat: _self.xAxisFormat,
                        yAxisFormat: _self.yAxisFormat, //自定义属性，tooltip标示，决定是否显示百分比数值还是人民币
                        // reverse: true,
                    },
                    yAxis: {
                        name: '募集规模（万元）'
                    },
                    xAxis: {
                        type: 'category',
                        // name: '期限',
                        // nameGap: 10,
                        // nameLocation: 'end',
                        boundaryGap: true,
                        data: _.map(_self.data, 'date')
                    },
                    series: [{
                        name: '日募集情况',
                        itemStyle: {
                            normal: {
                                opacity: 0.8,
                            },
                            emphasis: {
                                barBorderWidth: 1,
                                barBorderColor: 'rgba(0,0,0,.5)'
                            }
                        },
                        stack: '日募集情况',
                        type: 'bar',
                        barWidth: 30,
                        data: _.map(_self.data, 'amount')
                    }]
                })

                /*eslint-disable*/
                chart && chart.hideLoading()
                    /*eslint-enable*/
            }
        }
    })
})();

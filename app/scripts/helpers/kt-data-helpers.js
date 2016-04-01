/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')
        .factory('ktDataHelper', function() {
            return {
                /**
                 * [filterInit 筛选组件的初始化]
                 * @param  {[Array]} filters [初始filters]
                 * @param  {[Array]} options   [一个和filters 同长度的类型数组,用于不同的展示表现]
                 * @return {[Function]}      [根据参数处理active状态的函数]
                 */
                filterInit: function(filters, options) {
                    var _self = this
                    if (!filters.hasAdapt) {
                        _self._dataAdaptor(filters, options)
                    }
                    return function(params) {
                        _self.filterUpdate(filters, params)
                    }
                },
                filterUpdate: function(filters, params) { // 更新条件选中状态
                    _.each(filters || [], function(v) {
                        if (params[v.value]) {
                            _.each(v.options, function(o) {
                                /*eslint-disable*/
                                o.active = o.value == params[v.value]
                                    /*eslint-enable*/
                            })
                        } else { //默认是全部处于选中状态
                            _.each(v.options, function(o, i) {
                                /*eslint-disable*/
                                o.active = i === 0
                                    /*eslint-enable*/
                            })
                        }
                    })
                },
                getConditionName: function(filters) { // 获取条件具体名称
                    return function(type) {
                        var filter = _.find(filters, function(v) {
                            return v.value === type
                        }) || {}

                        var condition = _.find(filter.options || [], function(o) {
                            return o.active
                        })

                        if (condition) {
                            return condition.name
                        }

                    }
                },
                cutDirtyParams: function(params) { //删除全部时候的参数，避免后台出错
                    var newParams = $.extend(true, {}, params)
                    _.each(newParams, function(v, i) {
                        if (newParams[i] === 'all') {
                            delete newParams[i]
                        }
                    })

                    return newParams
                },
                getMarkLineCoords: function(data) { // null or ''值算出有效间隔点用虚线连接
                    if (!_.compact(data).length) {
                        //使用空值，避免markline不更新
                        return [
                            [{
                                coord: [0, 0],
                                symbol: 'none'
                            }, {
                                coord: [0, 0],
                                symbol: 'none'
                            }]
                        ]
                    }

                    var coords = _.chain(data).map(function(v, i) {
                            if (!_.isNil(v) && v !== '') {
                                return i
                            }
                        })
                        .filter(function(v) {
                            return !_.isNil(v)
                        })
                        .map(function(v, i, c) {
                            var nextDot = i + 1;
                            if (nextDot < c.length && c[nextDot] - v > 1) {
                                return [{
                                    coord: [v, data[v]],
                                    symbol: 'none'
                                }, {
                                    coord: [c[nextDot], data[c[nextDot]]],
                                    symbol: 'none'
                                }]
                            }

                            //使用空值，避免markline不更新
                            return [{
                                coord: [0, 0],
                                symbol: 'none'
                            }, {
                                coord: [0, 0],
                                symbol: 'none'
                            }]

                        }).filter(function(v) {
                            return !_.isNil(v)
                        }).value()

                    return coords

                },
                chartOptions: function(chartId, legend) { //根据legend的不同获取不同的坐标配置
                    var w = $(chartId + ' canvas').width()
                    var fontSize = 12
                    var leftGap = 40
                    var rightGap = 20
                    var lineHeight = 30
                    var lineLength = w - leftGap - rightGap / 2
                    var baseBottom = 70
                    var legendTotalLength = _.map(legend, function(v) {
                        return v.length * fontSize + 25
                    })

                    var lines = 1
                    var sum = 0

                    _.each(legendTotalLength, function(v) {
                            sum = sum + v
                            if (sum > lineLength) {
                                sum = v
                                lines++
                            }
                        })
                        // debugger
                    var op = {
                        legend: {
                            left: lines < 2 ? 'center' : leftGap,
                            right: lines < 2 ? 'auto' : rightGap
                        },
                        grid: {
                            bottom: lines < 2 ? baseBottom : ((lines - 1) * lineHeight + baseBottom)
                        }
                    }

                    return op
                },

                chartDataToPercent: function(chart) { //总览页计算各平台资产类型占比的百分比
                    var xAxisSumArr = []

                    _.each(chart.xAxis, function(v, i) {
                        xAxisSumArr[i] = _.sum(_.map(chart.data, function(v2) {
                            return v2.data[i]
                        }))
                    })

                    chart.data = _.map(chart.data, function(v) {
                        v.data = _.map(v.data, function(v2, i2) {
                            return (v2 / (xAxisSumArr[i2] || 1)) * 100 || null
                        })
                        return v
                    })
                    return chart
                },
                chartDataPrune: function(chart) { //替换null为'',否则echarts显示有问题,横坐标第一个值会没
                    chart.data = _.map(chart.data, function(v) {
                        v.data = _.map(v.data, function(v1) {
                            return _.isNil(v1) ? '' : v1
                        })
                        return v
                    })
                    return chart
                },
                chartAxisFormat: function(legend, format) { //格式化坐标轴label
                    var fl = _.map(legend, function(v) {
                        return parseInt(v, 10) + format
                    })

                    switch (format) {
                        case 'm':
                            fl = _.map(legend, function(v) {
                                return parseInt(v, 10) + '个月'
                            })
                            break
                        case 'M':
                            fl = _.map(legend, function(v) {
                                return parseInt(v, 10) + 'M'
                            })
                            break
                        case 'MY':
                            fl = _.map(legend, function(v) {
                                var month = parseInt(v, 10)
                                return month < 12 ? (month + 'M') : month / 12 + 'Y'
                            })
                            break
                        default:
                            fl = legend
                    }
                    return fl
                },
                getAxisMax: function(data) { //取坐标的最大值
                    var max = _.chain(data).map(function(v) {
                        return _.max(_.map(v.data, function(v2) {
                            return v2 || null
                        })) || null
                    }).max().add(1).ceil().value()

                    max = max % 2 ? max + 1 : max
                    return max
                },
                getAxisMin: function(data) { //取坐标的最小值
                    var min = _.chain(data).map(function(v) {
                        return _.min(_.map(v.data, function(v2) {
                            return v2 || null
                        })) || null
                    }).min().subtract(1).floor().value()

                    /*eslint-disable*/
                    min = (min % 2) ? (min > 0 ? (min - 1) : min) : min;
                    /*eslint-enable*/

                    return min
                },
                _optionsLengthLimit: function(filter) { //控制每个filter列表的长度
                    var optionWidth = $('.filter-box').width() - 25 * 2 - 157 + 66 //一行的长度，减去相关间距
                    var firstLineMaxIndex = filter.options.length;
                    var sumWidth = 0 //条件所占总长度

                    _.every(filter.options, function(v, i) {
                        sumWidth += (function() {
                            if (!v.name) return 0
                            return _.reduce(v.name.split(''), function(initial, n) {
                                return initial + 1 * (n.charCodeAt(0) > 128 ? 1 : 0.5)
                            }, 0)

                        }()) * 13 + 5 * 2 + 15 * 2

                        if (sumWidth > optionWidth) {
                            firstLineMaxIndex = i - 1 //超出一行的长度，获取索引位置
                            return false
                        }
                        return true
                    })

                    var filterFn = function(value, index) { //基于计算的长度过滤展示列表
                        if (!filter.collapsed) { //如果不折叠 全部显示
                            return true
                        }
                        return index <= firstLineMaxIndex
                    }

                    if (firstLineMaxIndex === filter.options.length) filterFn.hidden = true //如果能放下，隐藏

                    return filterFn

                },
                _dataAdaptor: function(filters, options) { // 将后台取到的filters数据加工符合前端的数据
                    var _self = this
                    options = options || []

                    _.each(filters, function(v) {
                        var option = _.find(options, { value: v.value })

                        v.type = (option && option.type) ? option.type : 'list'

                        v.options = _.map(v.options, function(o) {
                            return {
                                name: o[0],
                                visible: option && _.isNil(option.visible) ? option.visible : true,
                                value: o[1]
                            }
                        })

                        v.options.unshift({
                            name: '全部',
                            active: true,
                            visible: true,
                            value: 'all'
                        })

                        v.toggleView = function($event) { //折叠切换
                            v.collapsed = !v.collapsed
                            var target = $($event.target)
                            target = target.hasClass('icon-arrow') ? target.parent() : target
                            target.toggleClass('expand', !v.collapsed)
                        }

                        // 用于过滤的函数
                        v.filterFn = v.type === 'list' ?
                            (function() {
                                v.collapsed = _.isNil(v.collapsed) ? true : v.collapsed // 默认折叠
                                return _self._optionsLengthLimit(v)
                            })() : function() {
                                return true
                            }
                    })

                    filters.hasAdapt = true // 打标识，避免重复数据处理
                }
            }

        })

})();

/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    var dimensionSpecialColor = {
        asset_type: [
            '#6691d8', '#5cbae1', '#68d5b2', '#929fed', '#bf99ec', '#eace81', '#f4956f'
            // '#6691d8', '#8987ed', '#5cbae1', '#68d5b2', '#eace81', '#f4b673', '#e97384'
            // '#6691d8', '#5cbae1', '#68d5b2', '#eace81', '#f4b673', '#e97384', '#8987ed'
            // '#5a84ce', '#74b9d6', '#77bfa7', '#787edc', '#be9ce9', '#5caaaa', '#ebba54'
        ]
    }

    angular.module('kt.pano')
        .factory('ktDataHelper', function($window) {
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
                getDimentionSpecialColor: function(d) {
                    return dimensionSpecialColor[d] || []
                },
                getPerPage: function() { //windows pc 用户根据屏幕高度设置每页条数
                    if (!$window.isWindows() || $window.detectmob()) return 20

                    var minH = $window.innerHeight - 80 - 44 - 80
                    var lines = (minH / 40) | 0
                    return lines || 10
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
                pruneDirtyParams: function(params, search, list) {
                    _.each(params, function(v, i) {
                        //如果url地址中不包含则删除
                        if (search) {
                            var l = _.isArray(list) ? list : [list]
                            if (list && _.includes(l, i) && !search[i]) {
                                delete params[i]
                            } else if (!search[i] && _.includes(l, i)) {
                                delete params[i]
                            }
                        }
                    })
                },
                cutDirtyParams: function(params, search, list) { //删除全部时候的参数，避免后台出错
                    var newParams = $.extend(true, {}, params)
                    _.each(newParams, function(v, i) {
                        if (newParams[i] === 'all') {
                            delete newParams[i]
                        }

                        //如果url地址中不包含则删除
                        if (search) {
                            var l = _.isArray(list) ? list : [list]
                            if (list && _.includes(l, i) && !search[i]) {
                                delete params[i]
                            } else if (!search[i] && _.includes(l, i)) {
                                delete params[i]
                            }
                        }
                    })

                    return newParams
                },
                getMarkLineCoords: function(data) { // null or ''值算出有效间隔点用虚线连接
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

                        }).filter(function(v) {
                            return !_.isNil(v)
                        }).value()

                    coords = this._supplyMarkLine(coords, data.length)
                    return coords

                },
                _supplyMarkLine: function(coords, length) {
                    while (coords.length < length) {
                        coords.push([{
                            coord: [0, 0],
                            symbol: 'none'
                        }, {
                            coord: [0, 0],
                            symbol: 'none'
                        }])
                    }
                    return coords
                },

                chartOptions: function(chartId, legend) { //根据legend的不同获取不同的坐标配置
                    var w = $(chartId + ' canvas').width()
                    var fontSize = 12
                    var leftGap = 40
                    var rightGap = 40
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
                            right: lines < 2 ? 'auto' : rightGap / 2
                        },
                        grid: {
                            bottom: lines < 2 ? baseBottom : ((lines - 1) * lineHeight + baseBottom)
                        }
                    }

                    return op
                },

                chartDataToPercent: function(chart) { //总览页计算各平台资产类型占比的百分比
                    var xAxisSumArr = []

                    _.each(chart.xAxis, function(v, i) { //计算和
                        xAxisSumArr[i] = _.sum(_.map(chart.data, function(v2) {
                            return v2.data[i]
                        }))
                    })

                    /*_.remove(chart.xAxis, function(v, i) { //删除空值的坐标
                        return xAxisSumArr[i] === 0
                    })

                    _.each(chart.data, function(v) {
                        _.remove(v.data, function(v2, i2) {
                            return xAxisSumArr[i2] === 0
                        })
                    })

                    _.remove(xAxisSumArr, function(v) {
                        return v === 0
                    })*/

                    chart.data = _.map(chart.data, function(v) { // 计算所占比例
                        v.data = _.map(v.data, function(v2, i2) {
                            return (v2 / (xAxisSumArr[i2] || 1)) * 100 || null
                        })
                        return v
                    })

                    return chart
                },
                chartDataPrune: function(chart) { //替换null为'',否则echarts显示有问题,横坐标第一个值会没
                    var buShiYong = _.find(chart.data, function(v) {
                        return v.name === '不适用'
                    })

                    if (buShiYong) { //主要用于挂牌场所，
                        _.remove(chart.data, function(v) {
                            return v.name === '不适用'
                        })
                        chart.data.push(buShiYong)
                    }

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
                    }).max().ceil().value() + 1

                    // max = max % 2 ? max + 1 : max
                    return max
                },
                getAxisMin: function(data) { //取坐标的最小值
                    var min = _.chain(data).map(function(v) {
                        return _.min(_.map(v.data, function(v2) {
                            return v2 || null
                        })) || null
                    }).min().floor().value()

                    /*eslint-disable*/
                    // min = (min % 2) ? (min > 0 ? (min - 1) : min) : min;
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

                        // 如果是挂牌场所，需要把“不适用”放到最后
                        if (v.value === 'exchange_eq' || v.value === 'mapped_exchange') {
                            var buShiYong = _.find(v.options, function(o) {
                                return o[0] === '不适用'
                            })

                            _.remove(v.options, function(o) {
                                    return o[0] === '不适用'
                                })
                                /*eslint-disable*/
                            buShiYong && v.options.push(buShiYong)
                                /*eslint-enable*/
                        }

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

/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    // 针对资产类型，单独配色
    var dimensionSpecialColor = {
        asset_type: [
            '#6691d8', '#5cbae1', '#68d5b2', '#929fed', '#bf99ec', '#eace81', '#f4956f', '#e97384'
        ]
    }

    //  资产类型顺序指定
    var assetTypesOrder = ['企业借款类', '小微金融类', '供应链类', '金融工具类', '房地产类', '政信类', '票据类', '其它']

    // 多音字指定
    var spellSpecialMap = {
        '乐视金融': 'LSJR',
        '乐视': 'L',
        '重庆': 'C'
    }

    var pinyin = {
        getFirstCharSpell: function(str) {
            return spellSpecialMap[str.slice(0, 2)] || window.utils.HanZiPinYin.get(str.slice(0, 1))
        },
        get: function(str) {
            return spellSpecialMap[str] || window.utils.HanZiPinYin.get(str)
        }
    }

    angular.module('kt.pano')
        .factory('ktDataHelper', function($window, $rootScope, $state, notify) {
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
                        var activeIndex = 0
                        if (params[v.value]) {
                            _.each(v.options, function(o, i) {
                                if (o.value === params[v.value]) {
                                    o.active = true
                                    activeIndex = i
                                } else {
                                    o.active = false
                                }
                                // o.active = o.value == params[v.value] // eslint-disable-line
                            })

                        } else { //默认是“全部”处于选中状态
                            _.each(v.options, function(o, i) {
                                o.active = i === 0 // eslint-disable-line
                            })
                        }

                        if (activeIndex > v.filterFn.firstLineMaxIndex) {
                            v.collapsed = false
                        } else {
                            v.collapsed = true
                        }
                    })
                },

                // 维度的特殊颜色定义
                getDimentionSpecialColor: function(d) {
                    return dimensionSpecialColor[d] || []
                },

                //windows pc 用户根据屏幕高度设置每页条数
                getPerPage: function() {
                    if (!$window.isWindows() || $window.detectmob()) return 20

                    var minH = $window.innerHeight - 80 - 44 - 80
                    var lines = (minH / 40) | 0
                    return lines || 10
                },

                // 资产类型固定排序
                assetTypesOrderByPreset: function(arr, byKey) {
                    if (byKey) {
                        return _.sortBy(arr, function(v) {
                            return _.indexOf(assetTypesOrder, v[byKey])
                        })
                    }

                    return _.sortBy(arr, function(v) {
                        return _.indexOf(assetTypesOrder, v)
                    })

                },

                // 获取产品期限
                getLife: function(life) {
                    var lifeName = (!_.isNaN(+life) && !_.isNil(life) && life !== '') ? life + '天' : (life || '活期')
                    return lifeName
                },
                // 获取条件具体名称
                getConditionName: function(shared) {
                    return function(type) {
                        var filter = _.find(shared.filters, function(v) {
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
                // 去掉值是all的参数
                pruneDirtyParams: function(params, search, list) {
                    _.each(params, function(v, i) {
                        //如果url地址中不包含则删除
                        if (search) {
                            var l = _.isArray(list) ? list : [list]
                            if (list) { // 如果依据列表删除
                                if (_.includes(l, i) && !search[i]) {
                                    delete params[i]
                                }
                            } else if (!search[i]) { // 没依据则都删除
                                delete params[i]
                            }
                        }
                    })
                },
                //删除全部时候的参数，避免后台出错
                cutDirtyParams: function(params, search, list) {
                    var newParams = $.extend(true, {}, params)
                    _.each(newParams, function(v, i) {
                        if (newParams[i] === 'all') {
                            delete newParams[i]
                        }
                    })

                    this.pruneDirtyParams(newParams, search, list)

                    return newParams
                },
                // null or ''值算出有效间隔点用虚线连接
                getMarkLineCoords: function(data) {
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
                //根据legend的不同获取不同的坐标配置
                chartOptions: function(chartId, legend) {
                    var w = $(chartId + ' canvas').width()
                    var fontSize = 12
                    var leftGap = 40
                    var rightGap = 40
                    var lineHeight = 30
                    var lineWidthOffset = -10 //偏差
                    var lineLength = w - leftGap - rightGap / 2 + lineWidthOffset
                    var baseBottom = 70 // 默认底部高度
                    var legendTotalLength = _.map(legend, function(v) {
                        return _.chain(v.split('')).map(function(char) {
                            return (char.charCodeAt(0) > 128 ? 1 : 0.5) * fontSize
                        }).sum().value() + 25
                    })

                    var lines = 1
                    var sum = 0

                    // 计算总行数
                    _.each(legendTotalLength, function(v) {
                        sum = sum + v
                        if (sum > lineLength) {
                            sum = v
                            lines++
                        }
                    })

                    var op = {
                        legend: {
                            left: lines < 2 ? 'center' : leftGap, // 一行的时候居中对齐
                            right: lines < 2 ? 'auto' : rightGap / 2
                        },
                        grid: {
                            bottom: lines < 2 ? baseBottom : ((lines - 1) * lineHeight + baseBottom)
                        }
                    }

                    return op
                },
                // 总览气泡图按首字母排序
                sortByFirstChar: function(data) {
                    return _.sortBy(data, function(v) {
                        return pinyin.getFirstCharSpell(v[2])
                    })
                },
                // 总览气泡图按名称所有字母排序
                sortByChars: function(data) {
                    return _.sortBy(data, function(v) {
                        return pinyin.get(v[2])
                    })
                },
                //总览页计算资产类型发行量占比的百分比
                chartDataToPercent: function(chart, key) {
                    var xAxisSumArr = []
                    var dataKey = key || 'data'
                    _.each(chart.xAxis, function(v, i) { //计算和
                        xAxisSumArr[i] = _.sum(_.map(chart.data, function(v2) {
                            return v2[dataKey][i]
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

                    _.each(chart.data, function(v) { // 计算所占比例
                        v[dataKey + '_percent'] = _.map(v[dataKey], function(v2, i2) {
                            return (v2 / (xAxisSumArr[i2] || 1)) * 100 || null
                        })
                    })
                    chart.data = this.assetTypesOrderByPreset(chart.data, 'name')
                    return chart
                },
                //替换null为'',否则echarts显示有问题,横坐标第一个值会没
                chartDataPrune: function(chart) {
                    // 不适用移动到最后
                    var buShiYong = _.find(chart.data, function(v) {
                        return v.name === '不适用'
                    })

                    if (buShiYong) { //主要用于挂牌场所，
                        _.remove(chart.data, function(v) {
                            return v.name === '不适用'
                        })
                        chart.data.push(buShiYong)
                    }

                    // 其他移动到最后
                    var qita = _.find(chart.data, function(v) {
                        return v.name === '其它'
                    })

                    if (qita) { //主要用于挂牌场所，
                        _.remove(chart.data, function(v) {
                            return v.name === '其它'
                        })
                        chart.data.push(qita)
                    }

                    chart.data = _.map(chart.data, function(v) {
                        v.data = _.map(v.data, function(v1) {
                            return _.isNil(v1) ? '' : v1
                        })
                        return v
                    })
                    return chart
                },
                //格式化坐标轴label
                chartAxisFormat: function(legend, format) {
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
                //取坐标的最大值
                getAxisMax: function(data) {
                    var max = _.chain(data).map(function(v) {
                        return _.max(_.map(v.data, function(v2) {
                            return v2 || null
                        })) || null
                    }).max().ceil().value() + 1

                    // max = max % 2 ? max + 1 : max
                    return max
                },
                //取坐标的最小值
                getAxisMin: function(data) {
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

                // 与listOneLineFilter类似，不过处理的是字符串
                textEllipsis: function(text, container, subtractL, fontSize, maxLine, spaceCount) {
                    text = text || ''
                    var optionWidth = $(container).width() - subtractL
                    var letters = text.split('')
                    var textWidth = 0
                    var ml = maxLine || 1
                    var maxWidth = optionWidth * ml - fontSize * spaceCount
                    var truncateText = {
                        value: '',
                        showToggleBtn: false, //用于控制toggle按钮的显示隐层
                        isTruncate: false,
                        // toggleView: function($event) { //折叠切换
                        //     this.collapsed = !this.collapsed
                        //     var target = $($event.target)
                        //     target = target.hasClass('icon-arrow') ? target.parent() : target
                        //     target.toggleClass('expand', !this.collapsed)
                        // }
                    }

                    _.every(letters, function(v) {
                        textWidth += fontSize * (v.charCodeAt(0) > 128 ? 1 : 0.5)
                        if (textWidth >= maxWidth) {
                            truncateText.value += '...'
                            truncateText.isTruncate = true
                            truncateText.showToggleBtn = true
                            return false
                        }
                        truncateText.value += v
                        return true
                    })
                    return truncateText
                },
                // 与_optionsLengthLimit类似，不过此方法可以单独处理一个列表
                listOneLineFilter: function(list, container, subtractL, fontSize, paddingMargin, maxLine) {
                    var optionWidth = $(container).width() - subtractL
                    var lineMaxIndex = list.length;
                    var sumWidth = 0 //每一行标签所占总长度
                    var ml = maxLine || 1
                    var lines = 0; //filter内容

                    _.every(list, function(v, i) {
                        var vLength = (function() {
                            if (!v) return 0
                            return _.reduce(v.split(''), function(initial, n) {
                                return initial + 1 * (n.charCodeAt(0) > 128 ? 1 : 0.52)
                            }, 0)

                        }()) * fontSize + paddingMargin

                        sumWidth += vLength

                        if (sumWidth > optionWidth) {
                            lines++
                            if (lines >= ml) {
                                lineMaxIndex = i - 1 //超出一行的长度，获取索引位置
                                return false
                            }
                            sumWidth = vLength //重置新一行的初始长度
                            return true
                        }
                        return true
                    })

                    var filterFn = function(value, index) { //基于计算的长度过滤展示列表
                        if (!list.collapsed) { //如果不折叠 全部显示
                            return true
                        }
                        return index <= lineMaxIndex
                    }

                    if (lineMaxIndex === list.length) filterFn.hidden = true //如果能放下，隐藏

                    list.collapsed = _.isNil(list.collapsed) ? true : list.collapsed // 默认折叠
                    list.filterFn = filterFn
                    list.toggleView = function($event) { //折叠切换
                        list.collapsed = !list.collapsed
                        var target = $($event.target)
                        target = target.hasClass('icon-arrow') ? target.parent() : target
                        target.toggleClass('expand', !list.collapsed)
                    }
                    return list
                },
                //控制每个filter列表的长度
                _optionsLengthLimit: function(filter) {
                    var optionWidth = $('.filter-box').width() - 25 * 2 - 157 + 66 //一行的长度，减去相关间距
                    var firstLineMaxIndex = filter.options.length; // 第一行最后的元素索引位置
                    var sumWidth = 0 //条件所占总长度
                    var assitDiv = (function() {
                        return $('#filter-assit').length ? $('#filter-assit') : $('<div id="filter-assit"/>').appendTo('.filter-box')
                    })();

                    _.every(filter.options, function(v, i) { //用every替代each 可以break
                        /*sumWidth += (function() { //deprecated 数字英文0.52不太准确
                            if (!v.name) return 0
                            return _.reduce(v.name.split(''), function(initial, n) {
                                return initial + 1 * (n.charCodeAt(0) > 128 ? 1 : 0.52) // 0.52数字英文粗略宽度
                            }, 0)
                        }()) * 13 + 5 * 2 + 15 * 2*/

                        // 13 font-size; 5 padding; 15 margin
                        assitDiv.text(v.name)
                        sumWidth += assitDiv.width() + 5 * 2 + 15 * 2
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

                    filterFn.firstLineMaxIndex = firstLineMaxIndex

                    if (firstLineMaxIndex === filter.options.length) filterFn.hidden = true //如果能放下，隐藏

                    return filterFn

                },
                // 将后台取到的filters数据加工符合前端的数据-市场数据，产品信息，可预约产品页
                _dataAdaptor: function(filters, options) {
                    var _self = this
                    options = options || []

                    _.each(filters, function(v) {
                        var option = _.find(options, { value: v.value }) //自定义可见 option

                        v.type = (option && option.type) ? option.type : 'list'

                        // 如果是挂牌场所，需要把“不适用”放到最后
                        if (v.value === 'exchange_eq' || v.value === 'mapped_exchange') {
                            var buShiYong = _.find(v.options, function(o) {
                                return o[0] === '不适用'
                            })

                            _.remove(v.options, function(o) {
                                return o[0] === '不适用'
                            })

                            buShiYong && v.options.push(buShiYong) // eslint-disable-line
                        }

                        v.options = _.map(v.options, function(o) {
                            return {
                                name: o[0],
                                visible: option && _.isNil(option.visible) ? option.visible : true,
                                value: o[1]
                            }
                        })

                        // 资产类型要排序
                        if (v.value === 'asset_type_eq') {
                            v.options = _self.assetTypesOrderByPreset(v.options, 'name')
                        }

                        if (v.type === 'dropdown') {
                            v.onToggle = function(opened) {
                                if (opened) {
                                    $rootScope.bdTrack(['产品信息页', '下拉', v.name])
                                }
                            }
                            v.options.isOpen = false
                        }

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
                            if (!v.collapsed) {
                                $rootScope.bdTrack(['产品信息页', '展开', v.name])
                            }
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
                },

                // 特殊处理 市场数据页的筛选框 平台 资产类型 挂牌场所维度
                initSpecialFilters: function(sfs, originData, params, $scope) {
                    sfs.init = function() {
                        this.data = _.cloneDeep(originData)

                        var groupByArr = ['0123456789', 'ABCD', 'EFGH', 'IJKL', 'MNOP', 'QRST', 'UVWX', 'YZ', '不适用'] //分组依据

                        // 初始化适配前端的数据
                        _.each(this.data, function(sf) {
                            sf.defaultCheckedLength = 8 // 展示项默认是8个
                            sf.isOpen = false
                            sf.active = false
                            sf.id = _.uniqueId('sf_')

                            if (params.dimension === sf.value) { //确定当前维度
                                sf.active = true
                            }

                            // 弹出窗口，更新选中项列表和选项内的checked 状态
                            sf.updateOptionsCheckedStats = function() {
                                sf.updateRealCheckedItems()

                                sf.checkedItems = _.cloneDeep(sf.realCheckedItems)

                                sf.updateCheckedStats()
                                sf.checkedAll = !sf.checkedItems.length
                            }

                            // 弹出窗口，更新选项的checked状态
                            sf.updateCheckedStats = function() {
                                _.each(sf.options, function(o) {
                                    _.each(o, function(v) {
                                        v.checked = _.includes(sf.checkedItems, v.value)
                                    })
                                })
                            }

                            // 更新选中项列表
                            sf.updateCheckedItems = function(option) {
                                if (sf.active && sf.checkedItems.length >= 10 && option.checked) {
                                    option.checked = false
                                    notify.closeAll()
                                    notify({
                                        messageTemplate: '<span><i class="fa fa-warning mr5"></i>{{$message}}</span>',
                                        classes: 'pano-nofity pano-nofity-warning',
                                        message: '最多可选10个！',
                                        container: $('#' + sf.id)[0],
                                        duration: 1500
                                    })
                                    return
                                }

                                sf.checkedItems = _.chain(sf.options).map(function(o) {
                                    return _.chain(o).filter(function(v) {
                                        return v.checked
                                    }).value()
                                }).flattenDeep().sortBy('spell').map('value').value()
                            }

                            // 单个删除已选中列表的条目
                            sf.delCheckedItems = function($event, value) {
                                $event.stopPropagation()
                                _.remove(sf.checkedItems, function(v) {
                                    return v === value
                                })
                                sf.updateCheckedStats()
                            }

                            // 选定了并确定了选中项，对外展示的
                            sf.updateRealCheckedItems = function() {

                                var isAllDimension = params[sf.value] === 'all' || !params[sf.value]

                                sf.realCheckedItems = (function(df) {
                                    if (isAllDimension && sf.active) {
                                        // var opt = sf.options.recommend_options || sf.options
                                        if (sf.options.recommend_options) {
                                            return _.chain(sf.options.recommend_options).map(function(o) {
                                                return o.value
                                            }).slice(0, sf.defaultCheckedLength).value()
                                        }

                                        return _.chain(sf.options).map(function(o) {
                                            return _.map(o, function(v) {
                                                return v
                                            })
                                        }).flattenDeep().sortBy('spell').map(function(o) {
                                            return o.value
                                        }).filter(function(o) {
                                            return o !== '不适用'
                                        }).slice(0, sf.defaultCheckedLength).value()
                                    } else if (isAllDimension) {
                                        return []
                                    }

                                    return df ? df.split(',') : []
                                })(params[sf.value])

                            }

                            // 删除真实的选项（指弹窗外显示的）并更新url
                            sf.delRealCheckedItems = function(value) {
                                _.remove(sf.realCheckedItems, function(v) {
                                    return v === value
                                })
                                sf.updateUrl()
                                    // sf.updateRealCheckedItems()
                            }

                            // 全部删除
                            sf.clearChecked = function() {
                                sf.checkedItems = []
                                $rootScope.bdTrack(['市场数据页', '全部清除', sf.name])
                                _.each(sf.options, function(o) {
                                    _.each(o, function(v) {
                                        v.checked = false
                                    })
                                })
                            }

                            // 应用所选项
                            sf.applyCheckedItems = function() {
                                if (sf.active && !sf.checkedItems.length) {
                                    // $scope.$apply(function() {
                                    sf.error = '请至少选择一个展示项'
                                        // })
                                    return false
                                }
                                sf.realCheckedItems = _.cloneDeep(sf.checkedItems);
                                return true
                            }

                            // 更新url
                            sf.updateUrl = function() {
                                // sf.realCheckedItems = _.cloneDeep(sf.checkedItems);
                                // $scope.goTo(sf.value, sf.realCheckedItems.join(','))
                                var p = {}
                                p[sf.value] = sf.realCheckedItems.join(',')
                                $state.go($state.current.name, p)
                                sf.isOpen = false
                            }

                            // 应用所选项并更新url
                            sf.applyAndUpdateUrl = function() {
                                if (sf.applyCheckedItems()) {
                                    $rootScope.bdTrack(['市场数据页', '确定筛选', sf.name])
                                    sf.updateUrl()
                                }
                            }

                            // dropdown组件打开时 更新一下状态
                            sf.onToggle = function(open) {
                                if (open) {
                                    $rootScope.bdTrack(['市场数据页', '下拉筛选', sf.name])
                                    $scope.$apply(function() {
                                        sf.updateOptionsCheckedStats()
                                    })
                                }
                            }

                            // 展示filter内的dialog
                            sf.toggleDialog = function($event) {
                                $event.stopPropagation()
                                sf.isOpen = !sf.isOpen
                                if (sf.isOpen) {
                                    $rootScope.bdTrack(['市场数据页', '选择', '展示项', sf.name])
                                    sf.updateOptionsCheckedStats()
                                }
                            }

                            sf.onClose = function() {
                                $scope.$apply(function() {
                                    sf.isOpen = false
                                })
                            }

                            // 数据初始化，按字母分组 排序
                            sf.options = _.chain(sf.options).map(function(o) {
                                return {
                                    name: o[0],
                                    value: o[1],
                                    checked: false,
                                    spell: _.includes(['其它', '不适用'], o[0]) ? o[0] : pinyin.getFirstCharSpell(o[0]),
                                    // recommended: false,
                                }
                            }).groupBy(function(o) {
                                if (_.includes(['其它', '不适用'], o.name)) return '其它'
                                var match = _.find(groupByArr, function(g) {
                                    return g.indexOf(o.spell.slice(0, 1)) > -1
                                })
                                return match === '0123456789' ? '0-9' : match
                            }).value()

                            _.each(sf.options, function(o, k) {
                                sf.options[k] = _.sortBy(o, function(v) {
                                    return v.spell
                                })
                            })

                            // 推荐的内容选项
                            if (sf.recommend_options) {
                                var ro = _.map(sf.recommend_options, function(o) {
                                    return {
                                        name: o[0],
                                        value: o[1],
                                        checked: false,
                                        // spell: pinyin.get(o.name.slice(0, 1)), // 第一个字的拼音首字母
                                        // recommended: true // 是否热门推荐的
                                    }
                                })

                                sf.options.recommend_options = ro
                            }

                            sf.updateRealCheckedItems()
                        })
                    }
                },

                // 处理当前页面筛选状态
                intFitlerStatus: function($scope, search, ignoreParams) {

                    // 当前页面的过滤状态
                    var NORMAL_STATUS = $scope.NORMAL_STATUS = 0 // 无筛选无搜索状态
                    var SEARCH_STATUS = $scope.SEARCH_STATUS = 1 // 搜索状态来
                    var FILTER_STATUS = $scope.FILTER_STATUS = 2 // 筛选状态
                    var _self = this

                    // 判断当前页面的筛选和搜索状态
                    $scope.getFitlerStatus = function() {
                        var validParams = _self.cutDirtyParams(search)
                        var validParamKeys = _.filter(_.keys(validParams), function(v) {
                            return !_.includes(ignoreParams || ['page', 'per_page', 'order', 'sort_by', 'credit_right_or_eq', 'created_or_updated_in'], v)
                        })

                        if (_.includes(validParamKeys, 'key_word')) {
                            return SEARCH_STATUS
                        } else if (validParamKeys.length) {
                            return FILTER_STATUS
                        }
                        return NORMAL_STATUS
                    }
                }
            }

        })

})();

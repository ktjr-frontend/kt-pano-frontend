/**
 * requires ['echarts3.x', 'interact']
 */
;
(function() {
    'use strict';
    angular.module('kt.common')
        .directive('ktEchart', function($rootScope, ktValueFactory) {
            return {
                restrict: 'A',
                scope: {
                    chartOptions: '=chartOptions',
                    resizeBy: '=resizeBy' //用于更新echarts
                },
                link: function($scope, $element, $attr) {

                    if (echarts.getInstanceByDom($element[0])) {
                        return;
                    }

                    var myChart = echarts.init($element[0], 'theme1')
                    var valueFactory = ktValueFactory

                    $scope.$watch('resizeBy', function() { //解决div隐藏情况下宽度初始化为0，不显现图表的问题
                        setTimeout(function() { // 晚于digest执行
                            myChart.resize()
                        }, 50)
                    })

                    var option = {
                        tooltip: {
                            trigger: 'axis',
                            shadowStyle: {
                                color: 'rgba(0,0,0,.1)'
                            },
                            textStyle: {
                                color: 'white'
                            },
                            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter: function(params) {
                                if (!_.isArray(params)) return ''

                                var options = this.getOption()
                                var colors = options.color
                                var yAxisFormat = options.tooltip[0].yAxisFormat

                                var isReverse = options.tooltip[0].reverse
                                var titlePrefix = options.tooltip[0].titlePrefix || ''
                                var titleSuffix = options.tooltip[0].titleSuffix || ''
                                var titleFormat = options.tooltip[0].titleFormat || ''
                                var titlexAxisIndex = options.tooltip[0].titlexAxisIndex || 0
                                var noUnit = options.tooltip[0].noUnit
                                var title = _.isNumber(params[0].dataIndex) ? options.xAxis[titlexAxisIndex].data[params[0].dataIndex] : params[0].name

                                colors = options.tooltip[0].color || colors //hack 特殊颜色系列

                                if (isReverse) {
                                    /*eslint-disable*/
                                    params = _.reverse(params)
                                        /*eslint-enable*/
                                }

                                // 设置格式
                                var yAxisFormatArr = yAxisFormat.split('|')
                                if (yAxisFormat && yAxisFormatArr.length > 1) {
                                    _.each(yAxisFormatArr, function(v) {
                                        var rangeM = v.match(/{(\d+),(\d+)}/)
                                        if (rangeM) {
                                            _.each(params, function(p) {
                                                if (_.inRange(p.seriesIndex, parseInt(rangeM[1], 10), parseInt(rangeM[2], 10) + 1)) {
                                                    p.yAxisFormat = v.replace(/{\d+,\d+}/g, '')
                                                }
                                            })
                                        }
                                    })
                                } else {
                                    _.each(params, function(p) {
                                        p.yAxisFormat = yAxisFormat
                                    })
                                }
                                // _.each(params, function (p) {
                                //     if (range)
                                //     _.chain(yAxisFormats).map(function(v) {
                                //         var rangeM = v.match(/{(\d+),(\d+)}/)
                                //         if (rangeM) {
                                //             return _.times(Math.abs(_.subtract.apply(null, rangeM.slice(1))) + 1, function () {
                                //                 return v.replace(/{\d+,\d+}/g, '')
                                //             }) //根据seriesIndex范围生成相同的format
                                //         }
                                //         return _.times(params.length, function () {
                                //             return v
                                //         }) //如果是单个格式则生成和系列相同个数的格式
                                //     }).flattenDeep().value()
                                // })

                                if (titleFormat === '@ToWeekEnd') { //hack特殊格式显示一周范围
                                    title += ' ~ ' + moment(title).weekday(6).format('YYYY-MM-DD')
                                }

                                title = titlePrefix + title + titleSuffix

                                var res = '<div class="f1_2rem chart-tooltip-title" style="border-bottom: 1px solid rgba(255,255,255,.3);padding-bottom: 5px;margin-bottom:5px;">' +
                                    title + '</div><table class="f1_2rem chart-tooltip-table">';

                                res = _.reduce(params, function(sum, v) {
                                    return sum + '<tr><td class="justify"><i class="fa-circle fa" style="transform: scale(0.8);color:' + colors[v.seriesIndex] +
                                        ';"></i>' + v.seriesName + '：</td><td class="text-right"><span>' +
                                        valueFactory(v.data, v.yAxisFormat, noUnit).replace(/^(0万元|0)$/g, '-') + '</span></td></tr>'
                                }, res) + '</table>'

                                return res;
                            }.bind(myChart)
                        },
                        toolbox: {
                            show: false,
                            orient: 'vertical',
                            x: 'right',
                            y: 'center',
                            feature: {
                                saveAsImage: {
                                    show: true
                                }
                            }
                        },
                        yAxis: {
                            type: 'value',
                            boundaryGap: [0, '10%'],
                            axisLabel: {
                                textStyle: {
                                    color: '#666b76',
                                    fontSize: 10
                                },
                                formatter: function(value) {
                                    var yAxisFormat = this.getOption().tooltip[0].yAxisFormat
                                    return valueFactory(value, yAxisFormat).toString().replace(/%|万元|百万|元/g, '')
                                }.bind(myChart)
                            },
                        },
                        legend: {
                            bottom: 10,
                            data: []
                        },
                        xAxis: {
                            type: 'value',
                            axisLabel: {
                                formatter: function(value) {
                                    var xAxisFormat = this.getOption().tooltip[0].xAxisFormat
                                    return valueFactory(value, xAxisFormat)
                                }.bind(myChart)
                            },
                            data: []
                        },

                        series: []
                    }

                    // 此处不要覆盖option对象，$.extend 深拷贝会作用于数组元素，导致两次数组内容合并，尤其是xAixs的data问题
                    var finalOption = $.extend(true, {}, option, $scope.chartOptions || {})

                    if (finalOption.group) {
                        myChart.group = finalOption.group
                    }

                    if ($.isPlainObject(finalOption.customDataZoom)) {
                        updateCustomDataZoom(finalOption.customDataZoom)
                    }

                    myChart.setOption(finalOption);

                    myChart.on('legendselectchanged', function(e) { //图列选择事件
                        $rootScope.$broadcast('legendSelected', {
                            chartId: $attr.id,
                            target: e.name,
                            targetValue: e.selected[e.name]
                        })
                    })
                    myChart.on('click', function(e) {
                        var o = myChart.getOption()
                            /*eslint-disable*/
                        o.onclick && o.onclick.call(myChart, e)
                            /*eslint-enable*/
                    })

                    myChart.on('datazoom', function() {
                        var dataZooms = $scope.chartOptions.dataZoom
                        if (!dataZooms || $.isEmptyObject(dataZooms) || ($.isArray(dataZooms) && !dataZooms.length)) return
                        if ($.isPlainObject(dataZooms)) {
                            dataZooms = [dataZooms]
                        }

                        var args = _.toArray(arguments)

                        _.each(dataZooms, function(e) {
                            if ($.isFunction(e.onZoom)) e.onZoom.apply(myChart, args)
                        })
                    })
                    $element.data('echart', myChart) // dom上添加对myChart的引用

                    // 监听chartOptions
                    $scope.$watch('chartOptions', function(newValue, oldValue) {
                        if (newValue === oldValue) return

                        if (newValue && $.isPlainObject(newValue.customDataZoom)) {
                            updateCustomDataZoom(newValue.customDataZoom)
                        }
                        // jquery 的extend深copy会merge数组，注意这个坑
                        // myChart.setOption($.extend(true, {}, finalOption, newValue || {}), true);
                        myChart.setOption(_.mergeWith(finalOption, newValue || {}, function(objValue, srcValue) {
                            if (_.isArray(objValue)) {
                                return srcValue
                            }
                        }), true);
                    })

                    $(window).on('resize', function() {
                        myChart.resize()
                    })

                    // 自定义拖拽数据透视组件
                    function updateCustomDataZoom(options) {
                        var dataZoom = $element.find('.custom-data-zoom')

                        if (dataZoom.length) { // 如果存在只更新样式
                            dataZoom.css(options.styles || {})
                                .attr(options.attr || {})
                                .find('.zoom-box').css({
                                    left: options.start + '%',
                                    right: (100 - options.end) + '%'
                                })
                            return;
                        }

                        // 初始化实例
                        dataZoom = $('<div class="custom-data-zoom dn"/>')
                            .attr($.extend({
                                id: _.uniqueId('dataZoom')
                            }, options.attr || {}))
                            .append($('<div class="zoom-box" title="可以拖拽，放大缩小"/>').css({
                                left: options.start + '%',
                                right: (100 - options.end) + '%'
                            }))
                            .appendTo($element).css(options.styles || {})
                            .on('zoomUpdate', function(e, data) {
                                var chartOptions = myChart.getOption().customDataZoom
                                var zoomBox = $(this).find('.zoom-box')

                                zoomBox.attr({
                                    style: data.styles,
                                    'data-x': data.dataX
                                })

                                if (chartOptions.onZoom) {
                                    chartOptions.onZoom(data)
                                }
                            })

                        // 添加drag 和 resize 功能
                        interact('.zoom-box', {
                            context: $element[0]
                        }).draggable({
                            inertia: false,
                            restrict: {
                                restriction: '.custom-data-zoom',
                                endOnly: false,
                                elementRect: {
                                    left: 0,
                                    right: 1,
                                    top: 0,
                                    bottom: 1
                                }
                            },
                            onmove: function(event) {
                                var target = $(event.target)
                                var x = (parseFloat(target.attr('data-x')) || 0) + event.dx;

                                target.css({
                                    transform: 'translateX(' + x + 'px)'
                                }).attr('data-x', x)

                                // clearTimeout(timeoutHandle)
                                // timeoutHandle = setTimeout(function() {
                                fireOnZoom(target)
                                    // }, 300)

                                // $(target).parent().css('pointer-events', 'auto')
                            }
                        }).on('dragend', function() {
                            // $(event.target).parent().css('pointer-events', 'none')
                        }).resizable({
                            preserveAspectRatio: false,
                            restrict: {
                                restriction: '.custom-data-zoom',
                            },
                            edges: {
                                left: true,
                                right: true,
                                bottom: false,
                                top: false
                            },
                        }).on('resizemove', function(event) {

                            var target = $(event.target)
                            if (event.rect.width < (options.minWidth * target.parent().width() / 100 || 15)) return

                            var x = (parseFloat(target.attr('data-x')) || 0)
                            x += event.deltaRect.left;

                            target.css({
                                width: event.rect.width + 'px',
                                transform: 'translate(' + x + 'px)',
                            }).attr('data-x', x)

                            // clearTimeout(timeoutHandle)
                            // timeoutHandle = setTimeout(function() {
                            fireOnZoom(target)
                                // }, 300)

                            // $(target).parent().css('pointer-events', 'auto')
                        }).on('resizeend', function() {
                            // $(event.target).parent().css('pointer-events', 'none')
                        })

                        // 控制显示隐藏
                        $scope.$watch('chartOptions.filterVisible', function(newValue) {
                            if (newValue) {
                                dataZoom.fadeIn()
                            } else {
                                dataZoom.fadeOut()
                            }
                        })
                    }

                    var timeoutHandle
                        // when resize move or drag on move fire event and callback
                    function fireOnZoom(element) {
                        var el = $(element)

                        var chartOption = myChart.getOption().customDataZoom
                        var parent = el.parent()
                        var totalLength = parent.width()
                        var elPos = el.position()
                        var group = parent.attr('group')

                        var eventObj = {
                            type: 'dataZoom',
                            styles: el.attr('style'),
                            dataX: el.attr('data-x'),
                            // triggerType: 'manual', //避免死循环
                            start: _.round(elPos.left / totalLength, 2) * 100,
                            end: _.round((el.outerWidth() + elPos.left) / totalLength, 2) * 100,
                        }

                        if (group) {
                            $('.custom-data-zoom')
                                .filter(function() {
                                    return !$(this).is(parent) && $(this).attr('group') === group
                                })
                                .trigger('zoomUpdate', $.extend({
                                    triggerType: 'manual'
                                }, eventObj))
                        }

                        if (chartOption.onZoom) {
                            clearTimeout(timeoutHandle)
                            timeoutHandle = setTimeout(function() {
                                chartOption.onZoom(eventObj)
                            }, 300)
                        }
                    }
                }
            }
        })
        .directive('ktEchartLegend', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                // scope: true,
                link: function($scope, $element, $attr, ngModel) {
                    $element.on('change', function() {
                        var echart = $('#' + $attr.chartId).data('echart')
                        var option = {
                            legend: {
                                selected: {}
                            }
                        }

                        setTimeout(function() { // safari 的digest晚于echart的更新 存在问题，用settimeout延迟执行
                            option.legend.selected[$attr.name] = ngModel.$modelValue

                            if (echart) echart.setOption(option)
                        }, 10)
                    })

                    $scope.$on('legendSelected', function(e, data) {
                        // var echart = $('#' + $attr.chartId).data('echart')
                        if ($attr.name === data.target && $attr.chartId === data.chartId) {
                            ngModel.$setViewValue(data.targetValue)
                            ngModel.$render()
                        }
                    })
                }
            }
        })
})();

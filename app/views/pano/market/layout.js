;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktMarketLayoutCtrl', function($scope, $rootScope, $state, $location,
            ktSweetAlert, ktDataHelper, ktAnalyticsService, ktUpgradeMember) {
            $scope.shared = {
                filter_show: true,
                tabActive: {
                    tab0: false,
                    tab1: false
                }
            }

            var defaultParams = {
                dimension: 'from',
                start_at: moment().day(0).add(+(moment().day() > 0), 'w').subtract(6, 'weeks').add(1, 'days').format('YYYY-MM-DD'),
                end_at: moment().day(0).add(+(moment().day() > 0), 'w').format('YYYY-MM-DD'),
            }
            var search = $location.search()

            var params = $scope.shared.params = $.extend({}, defaultParams, search)
            $scope.dimensionOnToggle = function(open) {
                if (open) {
                    $rootScope.bdTrack(['市场数据页', '下拉', '细分维度'])
                }
            }

            $scope.shared.dimensions = []
                // $scope.showMoreFilters = false

            $.dateRangePickerLanguages.default.shortcuts = '' //不显示快捷方式四个字

            $scope.datepickerSettings = {
                // startOfWeek: 'monday',
                applyBtnClass: 'btn btn-navy-blue btn-xs',
                // batchMode: 'week-range',
                singleMonth: false,
                extraClass: 'date-picker-pano-top',
                showWeekNumbers: false,
                autoClose: false,
                onDatepickerOpened: function() {
                    $rootScope.bdTrack(['市场数据页', '下拉', '时间范围'])
                },
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
                        onClick: function() {
                            $rootScope.bdTrack(['市场数据页', '最近4周', '时间范围'])
                        },
                        dates: function() {
                            var end = moment().day(0).add(+(moment().day() > 0), 'w').toDate();
                            var start = moment(end).subtract(4, 'w').add(1, 'd').toDate();
                            return [start, end];
                        }
                    }, {
                        name: '最近6周',
                        onClick: function() {
                            $rootScope.bdTrack(['市场数据页', '最近6周', '时间范围'])
                        },
                        dates: function() {
                            var end = moment().day(0).add(+(moment().day() > 0), 'w').toDate();
                            var start = moment(end).subtract(6, 'w').add(1, 'd').toDate();
                            return [start, end];
                        }
                    }, {
                        name: '最近8周',
                        onClick: function() {
                            $rootScope.bdTrack(['市场数据页', '最近8周', '时间范围'])
                        },
                        dates: function() {
                            var end = moment().day(0).add(+(moment().day() > 0), 'w').toDate();
                            var start = moment(end).subtract(8, 'w').add(1, 'd').toDate();
                            return [start, end];
                        }
                    }
                    /*, {
                        name: '最近16周',
                        dates: function() {
                            var start = moment().day(0).add(+(moment().day() > 0), 'w').toDate();
                            var end = moment(start).subtract(16, 'w').add(1, 'd').toDate();
                            return [start, end];
                        }
                    }*/
                ]
            }

            $scope.datePicker = params.start_at + '~' + params.end_at
            $scope.$watch('datePicker', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var dates = newValue.split('~')
                    $scope.goTo({
                        start_at: dates[0],
                        end_at: dates[1]
                    })
                }
            })

            // 当前维度的名称
            $scope.getDimensionName = function() {
                if (!$scope.shared.dimensions.length) return ''

                var d = _.find($scope.shared.dimensions, {
                    value: params.dimension || defaultParams.dimension
                })
                return d.name
            }

            $scope.goTo = function(key, value) {
                var p = {}

                if ($.isPlainObject(key)) {
                    $.extend(p, key)
                } else {
                    // 重置三个维度的筛选项
                    _.each($scope.shared.dimensions, function(v) {
                        p[v.value] = 'all'
                    })

                    p[key] = value
                }

                $state.go($state.current.name, p)
            }

            $scope.shared.filters = []

            // 获取配置列表
            ktAnalyticsService.get({
                content: 'settings',
            }, function(data) {
                var dimensions = data['0'].shift()
                    // defaultParams.dimension = dimensions.options[0][1]
                $scope.specialFiltersOrigin = data['0'].slice(1)
                dimensions = $scope.shared.dimensions = _.map(dimensions.options, function(v) {
                    return {
                        name: v[0],
                        value: v[1]
                    }
                })
                dimensions.isOpen = false

                // 特殊筛选特殊处理-挂牌场所 资产类型 平台 三者的关系
                var sfs = $scope.shared.specialFilters = {}

                ktDataHelper.initSpecialFilters(sfs, $scope.specialFiltersOrigin, params, $scope)

                $scope.$watch('shared.params.dimension', function() {
                    sfs.init()
                })

                // sfs.init()

                // @deprecated
                // $scope.shared.filters = data['0']
                // var filterInit = ktDataHelper.filterInit($scope.shared.filters)
                // filterInit(params)

            })

            //切换tab
            $scope.tabSelect = function(state) {
                if ($state.current.name !== state) {
                    $state.go(state)
                    $rootScope.bdTrack(['市场数据页', '页面切换', state === 'pano.market.default' ? '资产类' : '资管类'])
                }
            }

            // 升级会员
            $scope.upgrade = function() {
                if ($rootScope.user.status === 'pended') {
                    ktSweetAlert.swal({
                        title: '',
                        html: true,
                        confirmButtonText: '我知道了',
                        text: '您的帐号正在审核中，待审核通过后方可进行升级操作。<br/> 审核结果会在1个工作日内以邮件或短信的形式通知，请您耐心等待。'
                    })
                } else {
                    ktUpgradeMember()
                }
            }

            // 资产管理类数据
            $scope.assetManger = {}
            ktAnalyticsService.get({
                content: 'rate_trend'
            }, function(data) {
                $scope.assetManger = data.stat
            })

        })
})();

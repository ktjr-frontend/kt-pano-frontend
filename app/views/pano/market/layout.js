;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktMarketLayoutCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper, ktAnalyticsService) {

            $scope.shared = {}
            var defaultParams = {
                dimension: 'asset_type',
                start_at: moment().day(0).add(+(moment().day() > 0), 'w').subtract(6, 'weeks').add(1, 'days').format('YYYY-MM-DD'),
                end_at: moment().day(0).add(+(moment().day() > 0), 'w').format('YYYY-MM-DD'),
            }
            var search = $location.search()

            var params = $scope.shared.params = $.extend({}, defaultParams, search)

            $scope.shared.dimensions = []
            $scope.showMoreFilters = false

            $.dateRangePickerLanguages.default.shortcuts = '' //不显示快捷方式四个字

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
                    p[key] = value
                }

                $state.go($state.current.name, p)
            }

            $scope.shared.filters = []

            $scope.toggleOptions = function(filterName) {
                $scope[filterName + 'Collapsed'] = !$scope[filterName + 'Collapsed']
            }

            ktAnalyticsService.get({
                content: 'settings',
            }, function(data) {
                var dimensions = data['0'].shift()
                defaultParams.dimension = dimensions.options[0][1]

                $scope.shared.dimensions = _.map(dimensions.options, function(v) {
                    return {
                        name: v[0],
                        value: v[1]
                    }
                })

                $scope.shared.filters = data['0']
                var filterInit = ktDataHelper.filterInit($scope.shared.filters)
                filterInit(params)

            })

        })
})();

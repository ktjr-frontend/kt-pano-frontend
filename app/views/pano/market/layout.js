;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktMarketLayoutCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper, ktMarketSettingsService) {

            $scope.shared = {}

            var search = $location.search()

            var params = $scope.shared.params = $.extend({
                // page: 1,
                dimension: 'from',
                start_at: moment().day(0).subtract(4, 'weeks').add(1, 'days').format('YYYY-MM-DD'),
                end_at: moment().day(0).format('YYYY-MM-DD'),
                // per_page: 10,
                // maxSize: 10
            }, search)

            $scope.shared.dimensions = []
            $scope.showMoreFilters = false

            $scope.datepickerSettings = {
                applyBtnClass: 'btn btn-navy-blue btn-xs',
                batchMode: 'week-range',
                singleMonth: false,
                extraClass: 'date-picker-analytics-top',
                showWeekNumbers: true,
                autoClose: false,
                showShortcuts: true,
                customShortcuts: [{
                    name: '过去4周',
                    dates: function() {
                        var start = moment().day(0).toDate();
                        var end = moment().day(0).subtract(4, 'weeks').add(1, 'days').toDate();
                        return [start, end];
                    }
                }, {
                    name: '过去8周',
                    dates: function() {
                        var start = moment().day(0).toDate();
                        var end = moment().day(0).subtract(8, 'weeks').add(1, 'days').toDate();
                        return [start, end];
                    }
                }, {
                    name: '过去16周',
                    dates: function() {
                        var start = moment().day(0).toDate();
                        var end = moment().day(0).subtract(16, 'weeks').add(1, 'days').toDate();
                        return [start, end];
                    }
                }]
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
                    value: params.dimension || 'from'
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

            ktMarketSettingsService.get(function(data) {
                var dimensions = data['0'].shift()
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

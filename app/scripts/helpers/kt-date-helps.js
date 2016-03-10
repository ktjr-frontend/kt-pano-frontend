/**
 * @author luxueyan
 */
;
(function() {
    'use strict';
    angular.module('kt.pano')
        .factory('ktDateHelper', function() {
            return {
                getDateDay: function (periodName) {
                    var startDate
                    var endDate
                    var targetDate

                    switch (periodName) {
                        case 'all':
                            startDate = ''
                            endDate = moment().subtract(1, 'd').format('YYYY-MM-DD')
                            break;
                        case 'lastWeek':
                            startDate = moment().subtract(1, 'w').format('YYYY-MM-DD')
                            endDate = moment().format('YYYY-MM-DD')
                            break;
                        case 'lastMonth':
                            startDate = moment().subtract(1, 'M').format('YYYY-MM-DD')
                            endDate = moment().format('YYYY-MM-DD')
                            break;
                        case 'nextWeek':
                            startDate = moment().format('YYYY-MM-DD')
                            endDate = moment().add(1, 'w').format('YYYY-MM-DD')
                            break;
                        case 'nextMonth':
                            startDate = moment().format('YYYY-MM-DD')
                            endDate = moment().add(1, 'M').format('YYYY-MM-DD')
                            break;
                        default:
                            targetDate = periodName.split('~')
                            startDate = moment(targetDate[0]).format('YYYY-MM-DD')
                            endDate = moment(targetDate[1]).format('YYYY-MM-DD')

                    }
                    return startDate + '~' + endDate
                },
                getDate: function(periodName) {
                    var startDate
                    var endDate
                    var targetDate

                    switch (periodName) {
                        case 'all':
                            startDate = ''
                            endDate = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'lastMonth':
                            targetDate = moment().subtract(1, 'month')
                            startDate = targetDate.date(1).format('YYYY-MM')
                            endDate = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'last3Month':
                            targetDate = moment().subtract(3, 'month')
                            startDate = targetDate.date(1).format('YYYY-MM')
                            endDate = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        case 'last6Month':
                            targetDate = moment().subtract(6, 'month')
                            startDate = targetDate.date(1).format('YYYY-MM')
                            endDate = moment().date(1).subtract(1, 'days').format('YYYY-MM')
                            break;
                        default:
                            targetDate = periodName.split('~')
                            startDate = moment(targetDate[0]).format('YYYY-MM')
                            endDate = moment(targetDate[1]).format('YYYY-MM')

                    }
                    return startDate + '~' + endDate
                },
                /**
                 * 根据location参数，确定日期组件的初始化状态
                 */
                initPeriod: function($scope, params) { //只针对单个项目的统计页面，所有项目的Dashboard 不太好兼容
                    var startDate = params.start_date
                    var endDate = params.end_date

                    // $scope.radioPeriodAll = this.getDate('all')
                    $scope.radioPeriodLastMonth = this.getDate('lastMonth')
                    $scope.radioPeriodLast3Month = this.getDate('last3Month')
                    $scope.radioPeriodLast6Month = this.getDate('last6Month')

                    if (startDate && endDate) {
                        $scope.radioPeriod = startDate + '~' + endDate
                    } else {
                        $scope.radioPeriod = $scope.radioPeriodLastMonth
                    }

                    $scope.radioPeriodCustom = ($scope.radioPeriod === $scope.radioPeriodLastMonth || $scope.radioPeriod === $scope.radioPeriodLast3Month || $scope.radioPeriod === $scope.radioPeriodLast6Month) ? 'custom' : $scope.radioPeriod

                },

                initPeriodDay: function($scope, params) { 
                    var startDate = params.start_date
                    var endDate = params.end_date

                    $scope.radioPeriodAll = this.getDateDay('all')
                    $scope.radioPeriodLastWeek = this.getDateDay('lastWeek')
                    $scope.radioPeriodLastMonth = this.getDateDay('lastMonth')
                    $scope.radioPeriodNextWeek = this.getDateDay('nextWeek')
                    $scope.radioPeriodNextMonth = this.getDateDay('nextMonth')

                    if (startDate && endDate) {
                        $scope.radioPeriod = startDate + '~' + endDate
                    } else if (!startDate && endDate === $scope.radioPeriodAll.split('~')[1]) {
                        $scope.radioPeriod = $scope.radioPeriodAll
                    } else {
                        $scope.radioPeriod = $scope.radioPeriodLastWeek
                    }

                },

                adapterInstitutionDashboard: function(data) {

                    function addSign(list) {
                        _.each(list || [], function(v) {
                            if (v.name.indexOf('已还') > -1) {
                                v.data = _.map(v.data, function(v2) {
                                    return -v2;
                                })
                            }
                        })
                    }

                    addSign(data.total_trends)
                    addSign(data.increment_trends)

                    return data
                }

                /*getPeriod: function(params) {
                    if (!params.startDate || !params.endDate) return 'lastMonth'

                    if (params.date_period === 'custom') return params.startDate + '~' + params.endDate

                    return params.date_period
                },

                getCustomPeriod: function (params) {
                    if (!params.startDate || !params.endDate) return 'custom'

                    if (params.date_period === 'custom') return params.startDate + '~' + params.endDate

                    return 'custom'
                },

                getPeriodName: function (date_period) {
                    return
                }*/

            }

        })

})();

;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOverviewCtrl', function($scope, $stateParams, ktProjectsReportService, ktInstitutionsService, ktDateHelper) {

            $scope.$emit('activeProjectChange', {
                projectID: $stateParams.projectID
            })

            $scope.radioPeriod = 'all'
            $scope.radioPeriodCustom = 'custom'

            $scope.institutions = []
            $scope.insitutionChange = function(id, name) {
                $scope.institutionName = name
                getData(id)
            }

            ktInstitutionsService.get(function(data) {
                data.institutions.unshift({
                    id: 'all',
                    name: '全部机构'
                })

                $scope.institutions = data.institutions
                $scope.institutionName = $scope.institutions[0].name
                    // getData($scope.institutions[0].id)
            })

            $scope.radioDataShowType = 'chart'

            $scope.timelimitsChart = {
                chartOptions: {},
                list: []
            }

            $scope.$watch('radioPeriod', function(newValue, oldvalue) {
                if (newValue !== oldvalue && newValue !== 'custom') {
                    getData($scope.activeInstID)
                }
            })

            var chartOptions = {
                tooltip: {
                    axisPointer: {
                        type: 'line',
                    },
                    valueType: 'rmb' //自定义属性，tooltip标示，决定是否显示百分比数值
                },
                dataZoom: [{
                    // show: true,
                    // realtime: true,
                    top: 48,
                    left: 78,
                    height: 290,
                    start: 30,
                    end: 70,
                    backgroundColor: 'rgba(0,0,0,0)', // 背景颜色
                    dataBackgroundColor: 'rgba(0,0,0,0)', // 数据背景颜色
                    xAxisIndex: 1,
                    onZoom: function(e) {
                        var xAxis = this.getOption().xAxis[1]
                        var l = xAxis.data.length
                        var startDate = xAxis.data[Math.ceil((l - 1) * e.start.toFixed(2) / 100)]
                        var endDate = xAxis.data[((l - 1) * e.end.toFixed(2) / 100) | 0]
                        console.log(e.start, e.end, e.startValue)
                        console.log(startDate, endDate, (l - 1) * e.end.toFixed(2) / 100, (l - 1) * e.start.toFixed(2) / 100)
                    },
                    type: 'slider'
                }],
            }

            function getDataKey(type) {
                var typesMap = {
                    'timelimitsChart': ['prncp_balns_by_term', 'incre_loan_amnt_by_term'],
                    'amountsChart': ['prncp_balns_by_amnt', 'incre_loan_amnt_by_amnt'],
                    // 'typeChart': ['prncp_balns_by_type', 'incre_loan_amnt_by_type'],
                    'locationsChart': ['prncp_balns_by_loc', 'incre_loan_amnt_by_loc'],
                    'gendersChart': ['prncp_balns_by_gender', 'incre_loan_amnt_by_gender'],
                    'agesChart': ['prncp_balns_by_age', 'prncp_balns_by_age_percent'],
                }

                var keys = typesMap[type]
                var prefix = keys[0]
                var suffix = ''
                    // prefix = $scope[type].chartDimension === '时点余额' ? keys[0] : keys[1]
                    // suffix = $scope[type].menuData.value === 'absolute' ? '' : '_percent'
                if (type === 'locationChart') suffix = suffix + '_' + $scope.locationChart.topDimension.toLowerCase()

                chartOptions = $.extend(true, {}, chartOptions, suffix === '_percent' ? {
                    tooltip: {
                        valueType: 'percent' //自定义属性，tooltip标示，决定是否显示百分比数值
                    },
                    yAxis: [{
                        interval: 0.2,
                        max: 1,
                        min: 0
                    }]
                } : {
                    tooltip: {
                        valueType: 'rmb'
                    }
                })

                return prefix + suffix
            }

            function udpateData(type) {
                var data = $scope.data

                var listName = getDataKey(type)
                $scope[type].list = data[listName]
                $scope[type].chartOptions = $.extend(true, {}, chartOptions, {
                    legend: {
                        data: _.map(data[listName], 'name')
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: data.dates
                    }, {
                        type: 'category',
                        boundaryGap: false,
                        data: data.dates
                    }],

                    series: _.map(data[listName], function(v) {
                        v.type = 'line'
                        v.stack = '堆积组'
                        v.barWidth = 40
                        return v
                    })
                })
            }

            function getData(instID) {
                var startDate
                var endDate
                var datePeriod
                datePeriod = ktDateHelper.getDate($scope.radioPeriod) || $scope.radioPeriodCustom
                datePeriod = datePeriod.split('~')
                startDate = datePeriod[0] || null
                endDate = datePeriod[1]

                $scope.activeInstID = instID || 'all'

                ktProjectsReportService.get({
                    type: 'assets_stats',
                    inst_id: instID,
                    start_date: startDate,
                    end_date: endDate
                }, function(data) {
                    $scope.data = data

                    udpateData('timelimitsChart')

                })
            }

            // 初始加载数据
            getData()

        })
})();

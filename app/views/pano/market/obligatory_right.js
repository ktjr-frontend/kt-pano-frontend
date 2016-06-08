;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktAssetService) {
            $scope.shared.tabActive.tab0 = true
            $.extend($scope.shared.params, $location.search(), { tab: 0 })

            ktAssetService.get({
                content: 'settings'
            }, function(data) {
                $scope.shared.filters = data['0']
                var filterInit = ktDataHelper.filterInit($scope.shared.filters)
                filterInit($scope.shared.params)
            })

            /*var chartOptions = {
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
            }*/
            ktAssetService.get(ktDataHelper.cutDirtyParams($scope.shared.params), function(res) {
                $scope.assets = res.fame_assets
                $scope.shared.params.totalItems = res.total_items || 1
            })
        })
})();

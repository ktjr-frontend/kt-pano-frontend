;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktAssetsCtrl', function($scope, $rootScope, ktAessetsProductService, ktDataHelper) {
        ktAessetsProductService.get({ id: 21213 },
                function(data) {
                    $scope.assetsDatas = data.products
                    $scope.original_products = data.original_products
                        //发行平台
                    var inst = $scope.inst = data.from_info
                    if (!inst) return
                    inst.descObj = ktDataHelper.textEllipsis(inst.form_introduce, '.init-main-info .desc', 0, 14, 3, 6)
                        //挂牌场所
                    var exchange = $scope.exchange = data.exchange_info
                    if (!exchange) return
                    exchange.exchangeObj = ktDataHelper.textEllipsis(exchange.exchange_introduce, '.init-main-info .desc', 0, 14, 3, 1)
                        //相似产品
                    $scope.similars = data.similar_products

                    // function counmn(arr) {
                    //     if (arr.length / 3)
                    //         for (var i = 0; i < arr.length; i++) {
                    //             if (arr.length / 3) {

                    //             }
                    //         }
                    // }
                })
            //日期选择
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
            }]
        }
    })
})();

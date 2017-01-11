;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktAssetsCtrl', function($scope, $rootScope, ktProductsService, ktDataHelper, ktSweetAlert, $stateParams, $location) {
        var id = $stateParams.id
        var search = $location.search()
        console.log(search)
        ktProductsService.get({ content: id },
            function(data) {
                $scope.assetsDatas = data.products
                    // $scope.partitions = data.procucts.partitions
                $scope.original_products = data.original_products

                //发行平台
                var inst = $scope.inst = data.from_info
                if (!inst) return
                inst.descObj = ktDataHelper.textEllipsis(inst.form_introduce, '.init-main-info .desc', 0, 14, 4, 6)

                //挂牌场所
                var exchange = $scope.exchange = data.exchange_info
                if (!exchange) return
                exchange.exchangeObj = ktDataHelper.textEllipsis(exchange.exchange_introduce, '.init-main-info .desc', 0, 14, 4, 1)

                //相似产品
                // function group(arr) {
                //     // debugger
                //     if (arr.length % 3 !== 0) {
                //         arr.push({
                //             empty: true
                //         })
                //         group(arr)

                //     } else {
                //         $scope.similars = arr
                //     }
                // }
                // console.log(data.products.partitions)
                // group(data.similar_products)

                function groupData(arr) {
                    if (arr.length % 3 !== 0) {
                        arr.push({
                            empty: true
                        })
                        groupData(arr)

                    } else {
                        $scope.partitions = arr
                    }
                }
                groupData(data.products.partitions)
                $scope.similars = data.similar_products
            })
        //弹出pano酱二维码
        $scope.alertCode = function() {
            ktSweetAlert.swal({
                title: '<p class="alert">' + '更多产品数据，请联系微信客服PANO酱' + '</p>',
                text: '<div class="img-pano">' + '<img src="../../../images/pano_wxSEC.png">' + '</div>',
                html: true,
                showCloseButton: true
                // showCancelButton: true
            })
        }
    })
})();

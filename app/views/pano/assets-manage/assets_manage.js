;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktAssetManageCtrl', function($scope, $rootScope, ktProductsService, ktDataHelper, ktSweetAlert, $stateParams) {
        var id = $stateParams.id
        ktProductsService.get({ content: id },
            function(data) {
                $scope.productManage = data.products
                var inst = $scope.inst = data.from_info
                if (!inst) return
                inst.descObj = ktDataHelper.textEllipsis(inst.from_introduce || inst.form_introduce, '.init-main-info .desc', 0, 14, 3, 6)
                $scope.similars = data.similar_products
                function groupData(arr) {
                    if (arr.length % 3 !== 0) {
                        arr.push({
                            empty: true
                        })
                        groupData(arr)

                    } else {
                        $scope.termRates = arr
                    }
                }
                console.log(data.products.partitions)
                groupData(data.products.partitions)

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

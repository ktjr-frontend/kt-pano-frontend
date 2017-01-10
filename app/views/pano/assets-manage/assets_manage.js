;
(function() {
    'use strict';
    angular.module('kt.pano').controller('ktAssetManageCtrl', function($scope, $rootScope, ktAessetsManageProductService, ktDataHelper) {
        ktAessetsManageProductService.get({ id: 1 },
            function(data) {
                $scope.productManage = data.products
                var inst = $scope.inst = data.from_info
                if (!inst) return
                inst.descObj = ktDataHelper.textEllipsis(inst.from_introduce, '.init-main-info .desc', 0, 14, 3, 6)
                $scope.similars = data.similar_products

            })
    })
})();

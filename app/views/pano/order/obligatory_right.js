;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderObligatoryRightCtrl', function($scope, $state, $location, ktDataHelper, ktAssetService) {
            var shared = $scope.shared
            var search = $location.search()

            shared.tabActive.tab0 = true
            $.extend(shared.params, search, { tab: 0 })
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by'])

            if (!shared.filterDatas) {
                ktAssetService.get({
                    content: 'settings'
                }, function(data) {
                    shared.filterDatas = data
                    shared.filters = data['0']
                    ktDataHelper.filterInit(shared.filters)(shared.params)

                })
            } else {
                shared.filters = shared.filterDatas['0']
                ktDataHelper.filterInit(shared.filters)(shared.params)
            }

            ktAssetService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                /*_.each(res.fame_assets, function(a) {
                    a.description = `<ol style="box-sizing: border-box; margin-top: 0px; margin-bottom: 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px;">
                                        <li style="box-sizing: border-box;">天房集团经营稳定：2014年在房地产开发收入的带动下，天房集团收入及盈利大幅增长，建材销售及其他业务为公司收入及盈利带来有益补充。且公司土地储备较为充足，为未来房地产开发业务奠定了良好基础。</li>
                                        <li style="box-sizing: border-box;">天房集团承债能力强：天房集团是天津市最大的房地产开发企业，区域竞争优势明显，2014年合并天津房信集团后，实力进一步增强，目前公司与各级政府主管部门及各业务相关单位客户建立并保持了长期良好的合作关系，具备很强的项目获利能力。</li>
                                        <li style="box-sizing: border-box;">天房集团资金来源渠道多样：公司目前融资渠道包括银行借款、发行债券、资产支持票据及保障房基金等，且公司与主要合作银行关系良好，具有很强的外部融资能力。</li>
                                        <li style="box-sizing: border-box;">以委托贷款的方式发放：本项目交易结构以委托贷款的形式向天房集团发放该笔融资款，将在中国人民银行征信系统上披露天房集团的融资信息，对天房集团形成约束。</li>
                                    </ol>`
                })*/
                $scope.assets = res.fame_assets
                shared._params.totalItems = res.total_items || 1
                $scope.$emit('totalItemGot', search)
            })
        })
})();

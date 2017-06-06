;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktAssetsTableListCtlr', function($scope, $rootScope, $state, $location, ktSweetAlert, ktDataHelper, ktSmallAssetsTableService, ktSmallAssetsSettingService) {
            var shared = $scope.shared
            var search = $location.search()
            var informationArr = ['institution', 'finance_type_str', 'desc', 'project_file_str']
            $scope.shared.placeholderText = '输入关键字，如机构名称、资金类型、详细介绍或资料名称'

            // 跳转机构详情
            $scope.gotoDetail = function(inst) {
                var url = $state.href('pano.institutions.detail', {
                    id: inst.name,
                    dimension: inst.type === '0' ? 'from' : 'mapped_exchange'
                })

                window.open(url, '_blank')
            }

            // 前往产品信息页
            $scope.gotoProducts = function(inst, type) {
                var params = {}
                if (inst.type === '0') {
                    params.from_eq = inst.name
                } else if (inst.type === '1') {
                    params.exchange_eq = inst.name
                }
                var url = $state.href(type === 'am' ? 'pano.products.assetManage' : 'pano.products.obligatoryRight', params)

                window.open(url, '_blank')
            }

            // 按价格范围标题
            $scope.rateSortTitle = function() {
                if (search.sort_by === 'rate') {
                    if (search.order === 'asc') {
                        return '按价格范围起始值由大到小排序'
                    }
                    return '取消按价格范围起始值排序'
                }
                return '按价格范围起始值由小到大排序'
            }

            // 按发行量排序标题
            $scope.amountSortTitle = function() {
                if (search.sort_by === 'amount') {
                    if (search.order === 'asc') {
                        return '按预计规模起始值由大到小排序'
                    }
                    return '取消按预计规模起始值排序'
                }
                return '按预计规模起始值由小到大排序'
            }
            //按更新时间排序
            $scope.dateSortTitle = function() {
                if (search.sort_by === 'updated_at') {
                    if (search.order === 'asc') {
                        return '按更新时间由新到旧排序'
                    }
                    return '取消按更新时间由新到旧排序'
                }
                return '按更新时间由旧到新排序'
            }


            shared._params.totalItems = 0
            $.extend(shared.params, search)
            shared._params.page = shared.params.page
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by', 'search_fields[]'])
            ktDataHelper.intFitlerStatus($scope, search)
            if (!shared.filterDatas) {
                ktSmallAssetsSettingService.get({}, function(res) {
                   shared.filterDatas = res['0']
                   shared.filters = shared.filterDatas
                   ktDataHelper.filterInit(shared.filters)(shared.params)
            })
                // shared.filterDatas = {
                //     filters: [{
                //         name: '机构类型',
                //         value: 'institution_type',
                //         options: [
                //             ['互联网金融平台', '0'],
                //             ['挂牌场所', '1']
                //         ]
                //     }]
                // }
            } else {
                shared.filters = shared.filterDatas
                ktDataHelper.filterInit(shared.filters)(shared.params)
            }

            ktSmallAssetsTableService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                // cacheData = res
                $scope.institutions = res.result.micro_finaces
                var searchResults = res.result.summary.find.search_results
                if (searchResults) {
                    res.result.summary.find.search_results = _.filter(searchResults, function(n) {
                        return n.search_count !== 0
                    })
                    res.result.summary.find.search_results.sort(function(a, b) {
                        if (_.indexOf(informationArr, a.name) > _.indexOf(informationArr, b.name)) {
                            return 1
                        } else if (_.indexOf(informationArr, a.name) < _.indexOf(informationArr, b.name)) {
                            return -1
                        }
                        return 0
                    })
                }
                $scope.summary = res.result.summary.find
                shared._params.totalItems = res.result.summary.find.all_related.count
                shared._params.totalPages = _.ceil(res.result.summary.find.all_related.count / shared.params.per_page)
                shared.params.page = search.page || shared.params.page // 修正pagination 初始化page到1导致的问题

                // $scope.$emit('totalItemGot', search)
                $scope.pageChanged = function() {
                    $location.search('page', shared.params.page)
                }
            })
        })
})();

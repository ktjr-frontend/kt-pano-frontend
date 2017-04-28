;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktInsitutionListCtrl', function($scope, $rootScope, $state, $location, ktSweetAlert, ktDataHelper, ktInsitutionRepositoriesService) {
            var shared = $scope.shared
            var search = $location.search()
            var informationArr = ['name', 'co_institution']
            $scope.shared.placeholderText = '输入关键字，如机构名称、主要合作机构'

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

            // 按收益率排序标题
            $scope.rateSortTitle = function() {
                if (search.sort_by === 'rate') {
                    if (search.order === 'asc') {
                        return '点击近七日收益率由大到小排序'
                    }
                    return '点击取消近七日收益率排序'
                }
                return '点击近七日收益率由小到大排序'
            }

            // 按发行量排序标题
            $scope.amountSortTitle = function() {
                if (search.sort_by === 'sum_amount') {
                    if (search.order === 'asc') {
                        return '点击近七日发行量由大到小排序'
                    }
                    return '点击取消近七日发行量排序'
                }
                return '点击近七日发行量由小到大排序'
            }

            shared._params.totalItems = 0
            $.extend(shared.params, search)
            shared._params.page = shared.params.page
            ktDataHelper.pruneDirtyParams(shared.params, search, ['order', 'sort_by', 'search_fields[]'])
            ktDataHelper.intFitlerStatus($scope, search)

            if (!shared.filterDatas) {
                shared.filterDatas = {
                    filters: [{
                        name: '机构类型',
                        value: 'institution_type',
                        options: [
                            ['互联网金融平台', '0'],
                            ['挂牌场所', '1']
                        ]
                    }]
                }
                shared.filters = shared.filterDatas.filters
                ktDataHelper.filterInit(shared.filters)(shared.params)

            } else {
                shared.filters = shared.filterDatas.filters
                ktDataHelper.filterInit(shared.filters)(shared.params)
            }

            ktInsitutionRepositoriesService.get(ktDataHelper.cutDirtyParams(shared.params), function(res) {
                // cacheData = res
                $scope.institutions = res.institutions
                $scope.updateTime = res.latest_uptime
                if (res.summary.find.search_results) {
                    res.summary.find.search_results = _.filter(res.summary.find.search_results, function(n) {
                        return n.search_count !== 0
                    })
                    res.summary.find.search_results.sort(function(a, b) {
                        if (_.indexOf(informationArr, a.name) > _.indexOf(informationArr, b.name)) {
                            return 1
                        } else if (_.indexOf(informationArr, a.name) < _.indexOf(informationArr, b.name)) {
                            return -1
                        }
                        return 0
                    })
                }
                $scope.summary = res.summary
                shared._params.totalItems = res.summary.find.count
                shared._params.totalPages = _.ceil(res.summary.find.count / shared.params.per_page)
                shared.params.page = search.page || shared.params.page // 修正pagination 初始化page到1导致的问题

                // $scope.$emit('totalItemGot', search)
                $scope.pageChanged = function() {
                    $location.search('page', shared.params.page)
                }
            })
        })
})();

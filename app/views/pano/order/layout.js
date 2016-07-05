;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderLayoutCtrl', function($scope, $state, $filter, $window, $location, ktSweetAlert, ktDataHelper, ktAssetIntentionService) {
            var perPageCount = ktDataHelper.getPerPage()

            var search = $location.search()
            $scope.shared = {}

            var params = $scope.shared.params = $.extend({
                page: 1,
                per_page: perPageCount,
            }, search)

            $scope.shared._params = {
                totalItems: 10,
                maxSize: $window.innerWidth > 480 ? 10 : 3
            }

            /*
             * 这里需要定义tab的active开关，否则每次加载，会默认触发第一个tab的click事件
             */
            $scope.shared.tabActive = {
                tab0: false,
                tab1: false
            }

            $scope.tabSelect = function(state, tab) {
                if ($state.current.name === state) return

                $.extend(params, {
                    tab: tab,
                    page: 1,
                    per_page: perPageCount,
                    status_eq: null,
                    asset_type_eq: null,
                    guarantees_eq: null,
                    rate_in: null,
                    sort_by: null,
                    order: null,
                    life_days_in: null
                })
                $state.go(state, params)
            }

            $scope.goTo = function(key, value) {
                var p = {}
                p[key] = value
                $state.go($state.current.name, p)
            }

            $scope.$on('totalItemGot', function(event, data) { //totalItem 不满足初始page的会自动跳转到第一页
                params.page = data.page
                $scope.pageChanged = function() {
                    $location.search('page', params.page)
                }
            })

            // 预计上线时间
            $scope.getPublishDate = function(start, end) {
                var startDate = start ? moment(start).format('YYYY-MM-DD') : '-'
                var endDate = end ? moment(end).format('YYYY-MM-DD') : '-'
                if (start && end) {
                    return startDate + ' ~ ' + endDate
                } else if (!end && start) {
                    return startDate
                } else if (end && !start) {
                    return '至' + endDate
                }
                return '-'
            }

            // 年化收益率
            $scope.getRate = function(dr, hr) {
                if (_.isNil(dr) && _.isNil(hr)) {
                    return '-'
                } else if (_.isNil(dr) && !_.isNil(hr)) {
                    return hr.toFixed(2) + '%'
                } else if (_.isNil(hr) && !_.isNil(dr)) {
                    return dr.toFixed(2) + '%'
                } else if (dr === hr) {
                    return dr.toFixed(2) + '%'
                }

                return dr.toFixed(2) + '%' + '-' + hr.toFixed(2) + '%'
            }

            // 获取状态
            $scope.getStatus = function(status) {
                if (status === '已发布') {
                    return '可预约'
                } else if (status === '预约结束') {
                    return '已售罄'
                }
                return status || '-'
            }

            // 产品期限
            $scope.getLife = function(life) {
                var lifeName = (!_.isNaN(+life) && !_.isNil(life) && life !== '') ? life + '天' : (life || '-')
                return lifeName
            }

            // 与我联系
            $scope.contactMe = function(assetID) {
                ktSweetAlert.swal({
                    title: '对该资产有意向',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    showLoaderOnConfirm: true,
                    text: '如果您对该资产有意向，我们将尽快与您联系。'
                }, function(isConfirmed) {
                    if (isConfirmed) {
                        ktAssetIntentionService.save({
                            asset_id: assetID
                        }, function() {
                            ktSweetAlert.swal({
                                title: '已收到您的要求，开通金融会尽快与您联系',
                                type: 'success',
                                text: '<i class="icon-pano icon-phone mr5 f1_2rem"></i><a class="mr20">010-84551488</a><i class="icon-pano icon-message mr5 f1_2rem"></i><a href="mailto:HelloPano@ktjr.com">HelloPano@ktjr.com</a>',
                                html: true
                            })
                        }, function() {
                            ktSweetAlert.error('抱歉！服务器繁忙。')
                        })
                    }
                })
            }

            // 项目亮点
            $scope.showPoint = function(contents) {
                var filterStyle = function(value) {
                    var v = $filter('ktFontFamilyIgnore')(value)
                    v = $filter('ktFontSizeIgnore')(v)
                    v = $filter('ktParagraphStyleIgnore')(v)
                    return v
                }

                ktSweetAlert.swal({
                    title: '<h5 class="text-left f1_6rem">项目亮点</h5>',
                    html: true,
                    text: '<div class="asset-point-list text-left lh1_5em">' + filterStyle(contents) + '</div>'
                })
            }

            $scope.shared.filters = []
            $scope.shared.filtersDatas = null
            $scope.getConditionName = ktDataHelper.getConditionName($scope.shared.filters)
        })
})();

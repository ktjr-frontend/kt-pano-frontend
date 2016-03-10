;
(function() {
    'use strict';
    angular.module('kt.pano')
        .controller('ktOrderLayoutCtrl', function($scope, $state, $location, ktSweetAlert, ktDataHelper, ktAssetIntentionService) {

            var params = $location.search()
            $scope.shared = {}
            
            $scope.shared.params = $.extend({
                tab: 0,
                page: 1,
                per_page: 10,
                totalItems: 50,
                maxSize: 10
            }, params)

            /*
             * 这里需要定义tab的active开关，否则每次加载，会默认触发第一个tab的click事件
             */
            $scope.shared.tabActive = { 
                tab0: false,
                tab1: false
            }

            $scope.tabSelect = function(state, tab) {
                $.extend($scope.shared.params, {
                    tab: tab,
                    page: 1,
                    per_page: 10,
                    sort_by: null,
                    order: null,
                    asset_type_eq: null,
                    guarantees_eq: null,
                    life_days_in: null
                })
                $state.go(state, $scope.shared.params)
            }

            $scope.goTo = function(key, value) {
                var params = {}
                params[key] = value
                $state.go($state.current.name, params)
            }

            $scope.pageChanged = function() {
                $location.search('page', $scope.params.page)
            }

            $scope.contactMe = function(assetID) {
                ktAssetIntentionService.save({
                    asset_id: assetID
                }, function() {
                    ktSweetAlert.swal({
                        title: '',
                        text: '资产方以获取您的意向，稍后会与你联系。',
                        type: 'success'
                    })
                })
            }

            $scope.shared.filters = []

        })
})();

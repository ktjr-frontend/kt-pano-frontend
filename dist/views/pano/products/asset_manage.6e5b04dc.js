!function(){"use strict";angular.module("kt.pano").controller("ktProductAssetManageCtrl",["$scope","$state","$location","ktSweetAlert","ktDataHelper","ktCompassAssetFiltersService","ktCompassAssetService",function(a,b,c,d,e,f,g){var h=a.shared,i=c.search();h.tabActive.tab1=!0,$.extend(h.params,i,{credit_right_or_eq:"am"}),h.filterDatas?(h.filters=h.filterDatas[1],e.filterInit(h.filters)(h.params)):f.get(function(a){h.filterDatas=a,h.filters=a[1],e.filterInit(h.filters)(h.params)}),g.get(e.cutDirtyParams(h.params),function(b){a.products=b.compass_assets,h.params.totalItems=b.total_items,h.today_added_count=b.today_added_count,a.$emit("totalItemGot",i)})}])}();
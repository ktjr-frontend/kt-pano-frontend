!function(){"use strict";angular.module("kt.pano").controller("ktProductAssetManageCtrl",["$scope","$rootScope","$state","$location","ktSweetAlert","ktDataHelper","ktProductsService",function(a,b,c,d,e,f,g){var h,i=a.shared,j=d.search(),k=[{value:"rate_in",type:"dropdown"},{value:"credit_manager_eq",type:"dropdown"}];a.gotoDetail=function(a){"Product"===a["class"]?c.go("pano.productAssetManage",{id:a.id}):e.swal({title:"提示",timer:1500,text:"该产品暂未录入详情"})},a.updatedAtSortTitle=function(){return"updated_at"===j.sort_by?"asc"===j.order?"点击按更新时间由新到旧排序":"点击取消按更新时间排序":"点击按更新时间由旧到新排序"},a.rateSortTitle=function(){return"rate"===j.sort_by?"asc"===j.order?"点击按年化收益率由大到小排序":"点击取消按年化收益率排序":"点击按年化收益率由小到大排序"},i.tabActive.tab1=!0,i._params.created_or_updated_in=_.isString(j.created_or_updated_in)?j.created_or_updated_in.split(","):j.created_or_updated_in||[],i._params.totalItems=0,$.extend(i.params,j,{credit_right_or_eq:"am"}),i._params.page=i.params.page,f.pruneDirtyParams(i.params,j,["order","sort_by","created_or_updated_in"]),f.intFitlerStatus(a,j),i.filterDatas?(i.filters=i.filterDatas[1],f.filterInit(i.filters,k)(i.params)):g.get({content:"settings"},function(a){i.filterDatas=a,i.filters=a[1],f.filterInit(i.filters,k)(i.params)}),g.get(f.cutDirtyParams(i.params),function(b){h=b,a.products=b.products,a.summary=b.summary,i._params.totalItems=b.summary.find.count,i._params.totalPages=_.ceil(b.summary.find.count/i.params.per_page),i.params.page=j.page||i.params.page,a.pageChanged=function(){d.search("page",i.params.page)},a.$watch("shared._params.created_or_updated_in.length",function(){_.isArray(i._params.created_or_updated_in)&&c.go(c.current.name,{created_or_updated_in:i._params.created_or_updated_in.sort().join()})})}),a.searchTabActiveIndex=-1,a.searchTabClick=function(b,c){a.searchTabActiveIndex=c,a.searchResultAllActive=!1,g.get($.extend({"search_fields[]":b},f.cutDirtyParams(i.params)),function(b){a.products=b.products,i._params.totalItems=b.summary.find.count,i._params.totalPages=_.ceil(b.summary.find.count/i.params.per_page),a.$emit("totalItemGot",j)})},a.searchResultAllActive=!1,a.showAllSearchResults=function(){a.searchResultAllActive=!0,a.searchTabActiveIndex=-1,a.products=h.products,i._params.totalItems=h.summary.find.count,i._params.totalPages=_.ceil(h.summary.find.count/i.params.per_page)}}])}();
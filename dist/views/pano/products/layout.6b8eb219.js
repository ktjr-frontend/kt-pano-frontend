!function(){"use strict";angular.module("kt.pano").controller("ktProductsLayoutCtrl",["$scope","$window","$timeout","$state","$location","ktSweetAlert","ktDataHelper",function(a,b,c,d,e,f,g){var h=g.getPerPage(),i=e.search();a.shared={},a.shared.today_added_count=0;var j=a.shared.params=$.extend({page:1,per_page:h},i);a.shared._params={totalItems:10,totalPages:1,maxSize:b.innerWidth>480?10:3},a.shared.tabActive={tab0:!1,tab1:!1},a.tabSelect=function(a){d.current.name!==a&&d.go(a,$.extend(j,{status_eq:null,life_days_in:null,rate_in:null,asset_type_eq:null,exchange_eq:null,credit_manager_eq:null,created_or_updated_in:null,from_eq:null,sort_by:null,page:1,order:null}))},a.goTo=function(a,b){var c={};c[a]=b,c.page=1,d.go(d.current.name,c)},a.pageGoto=function(b,c,e){if(e=parseInt(e,10),!(e<1||e>a.shared._params.totalPages)&&13===b.keyCode){var f={};f[c]=e,d.go(d.current.name,f)}},a.goToByEnterKey=function(b,c,d){13===b.keyCode&&a.goTo(c,d)},a.$on("totalItemGot",function(b,c){j.page=c.page,a.pageChanged=function(){e.search("page",j.page)}}),a.getStatusName=function(a){return"可购买"===a?"在售":a||"-"},a.getLife=g.getLife,a.shared.filters=[],a.shared.filterDatas=null,a.getConditionName=g.getConditionName(a.shared)}])}();
!function(){"use strict";angular.module("kt.pano").controller("ktProductsLayoutCtrl",["$scope","$rootScope","$window","$timeout","$state","$location","ktSweetAlert","ktDataHelper",function(a,b,c,d,e,f,g,h){var i=10,j=f.search();a.shared={},a.shared.today_added_count=0;var k=a.shared.params=$.extend({page:1,per_page:i},j);a.shared._params={totalItems:0,totalPages:1,maxSize:c.innerWidth>480?10:3},a.shared.tabActive={tab0:!1,tab1:!1},a.tabSelect=function(a){e.current.name!==a&&(e.go(a,$.extend(k,{status_eq:null,life_days_in:null,key_word:null,rate_in:null,asset_type_eq:null,exchange_eq:null,credit_manager_eq:null,created_or_updated_in:null,from_eq:null,sort_by:null,page:1,order:null})),b.bdTrack(["产品信息页","切换","pano.products.obligatoryRight"===a?"资产类":"资管类"]))},a.goTo=function(a,b){var c={};c[a]=b,c.page=1,e.go(e.current.name,c)},a.pageGoto=function(b,c,d){if(d=parseInt(d,10),!(1>d||d>a.shared._params.totalPages)&&13===b.keyCode){var f={};f[c]=d,e.go(e.current.name,f)}},a.goToByEnterKey=function(c,d,e){13===c.keyCode&&(b.bdTrack(["产品信息页","确认","搜索","回车"]),a.goTo(d,e))},a.getStatusName=function(a){return"可购买"===a?"在售":a||"-"},a.getLife=h.getLife,a.shared.filters=[],a.shared.filterDatas=null,a.getConditionName=h.getConditionName(a.shared)}])}();
!function(){"use strict";angular.module("kt.pano").controller("ktMarketLayoutCtrl",["$scope","$state","$location","ktSweetAlert","ktDataHelper","ktAnalyticsService",function(a,b,c,d,e,f){a.shared={tab_show:!0};var g={dimension:"from",start_at:moment().day(0).add(+(moment().day()>0),"w").subtract(6,"weeks").add(1,"days").format("YYYY-MM-DD"),end_at:moment().day(0).add(+(moment().day()>0),"w").format("YYYY-MM-DD")},h=c.search(),i=a.shared.params=$.extend({},g,h);a.shared.dimensions=[],$.dateRangePickerLanguages["default"].shortcuts="",a.datepickerSettings={applyBtnClass:"btn btn-navy-blue btn-xs",singleMonth:!1,extraClass:"date-picker-pano-top",showWeekNumbers:!1,autoClose:!1,beforeShowDay:function(a){var b=moment(),c=a<=(b.day()?b.day(0).add(1,"w").toDate():b.toDate())&&a>=moment("2016-03-01").toDate(),d="",e=c?"":"不在可选范围内";return[c,d,e]},showShortcuts:!0,customShortcuts:[{name:"最近4周",dates:function(){var a=moment().day(0).add(+(moment().day()>0),"w").toDate(),b=moment(a).subtract(4,"w").add(1,"d").toDate();return[b,a]}},{name:"最近6周",dates:function(){var a=moment().day(0).add(+(moment().day()>0),"w").toDate(),b=moment(a).subtract(6,"w").add(1,"d").toDate();return[b,a]}},{name:"最近8周",dates:function(){var a=moment().day(0).add(+(moment().day()>0),"w").toDate(),b=moment(a).subtract(8,"w").add(1,"d").toDate();return[b,a]}}]},a.datePicker=i.start_at+"~"+i.end_at,a.$watch("datePicker",function(b,c){if(b!==c){var d=b.split("~");a.goTo({start_at:d[0],end_at:d[1]})}}),a.getDimensionName=function(){if(!a.shared.dimensions.length)return"";var b=_.find(a.shared.dimensions,{value:i.dimension||g.dimension});return b.name},a.goTo=function(c,d){var e={};$.isPlainObject(c)?$.extend(e,c):(_.each(a.shared.dimensions,function(a){e[a.value]="all"}),e[c]=d),b.go(b.current.name,e)},a.shared.filters=[],f.get({content:"settings"},function(b){var c=b[0].shift();a.specialFiltersOrigin=b[0].slice(1),c=a.shared.dimensions=_.map(c.options,function(a){return{name:a[0],value:a[1]}}),c.isOpen=!1;var d=a.shared.specialFilters={};e.initSpecialFilters(d,a.specialFiltersOrigin,i,a),a.$watch("shared.params.dimension",function(){d.init()})}),a.tabSelect=function(a){b.current.name!==a&&b.go(a)},a.assetManger={},f.get({content:"rate_trend"},function(b){a.assetManger=b.stat})}])}();
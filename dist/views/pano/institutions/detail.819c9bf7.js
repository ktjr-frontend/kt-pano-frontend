!function(){"use strict";angular.module("kt.pano").controller("ktInsitutionCtrl",["$scope","$location","$state","ktInsitutionsService","ktAnalyticsService","ktCompassAssetService","ktDataHelper","ktValueFactory",function(a,b,c,d,e,f,g,h){function i(a){"from"===l.dimension?a.from_eq=l.from:"mapped_exchange"===l.dimension&&(a.exchange_eq=l.mapped_exchange)}var j={dimension:"from",start_at:moment().day(0).add(+(moment().day()>0),"w").subtract(6,"weeks").add(1,"days").format("YYYY-MM-DD"),end_at:moment().day(0).add(+(moment().day()>0),"w").format("YYYY-MM-DD")},k=b.search(),l=a.params=$.extend({},j,k);l[l.dimension]=c.params.id,a.partnerType=function(){return"from"===l.dimension?"mapped_exchange":"mapped_exchange"===l.dimension?"from":void 0},a.tabActive={tab1:!0,tab2:!1},a.moreChartView=function(){var a={dimension:l.dimension};a[l.dimension]=c.params.id,c.go("pano.market.default",a)},a.datepickerSettings={applyBtnClass:"btn btn-navy-blue btn-xs",singleMonth:!1,extraClass:"date-picker-pano-top",showWeekNumbers:!1,autoClose:!1,beforeShowDay:function(a){var b=moment(),c=a<=(b.day()?b.day(0).add(1,"w").toDate():b.toDate())&&a>=moment("2016-03-01").toDate(),d="",e=c?"":"不在可选范围内";return[c,d,e]},showShortcuts:!0,customShortcuts:[{name:"最近4周",dates:function(){var a=moment().day(0).add(+(moment().day()>0),"w").toDate(),b=moment(a).subtract(4,"w").add(1,"d").toDate();return[b,a]}},{name:"最近6周",dates:function(){var a=moment().day(0).add(+(moment().day()>0),"w").toDate(),b=moment(a).subtract(6,"w").add(1,"d").toDate();return[b,a]}},{name:"最近8周",dates:function(){var a=moment().day(0).add(+(moment().day()>0),"w").toDate(),b=moment(a).subtract(8,"w").add(1,"d").toDate();return[b,a]}}]},a.datePicker=l.start_at+"~"+l.end_at,a.$watch("datePicker",function(a,b){if(a!==b){var c=a.split("~"),d={start_at:c[0],end_at:c[1]};s.updateDataView(d),t.updateDataView(d),u.updateDataView(d)}});var m=function(a){return _.map(a,function(a){return moment(a).format("MMDD~")+moment(a).weekday(6).format("MMDD")})},n=40,o=65,p=50,q=80,r={tooltip:{valueType:"rmb"},toolbox:{show:!1},legend:{left:"center",right:n/2,textStyle:{fontSize:12,color:"#626472"}},yAxis:{nameGap:20,splitLine:{show:!0,lineStyle:{color:["#f3f3f3"],width:1,type:"solid"}}},grid:{show:!0,top:p,left:o,right:n,bottom:q}},s=a.weekAmountChart={chartOptions:{},_params:{},yAxisFormat:"rmb",yAxis:"amount",xAxisFormat:null,list:[]};s.updateDataView=function(b){function c(){var a=d.data,b=_.map(a.data,"name"),c=g.chartOptions("#weekAmountChart",b);d.chartOptions=$.extend(!0,{},r,c,{legend:{data:b},tooltip:{axisPointer:{axis:"auto",type:"line"},reverse:!0,titlexAxisIndex:1,titleFormat:"@ToWeekEnd",titleSuffix:"发行量",xAxisFormat:d.xAxisFormat,yAxisFormat:d.yAxisFormat},yAxis:{name:"发行量（单位：万元）"},xAxis:[{type:"category",name:"周",nameLocation:"end",axisLabel:{interval:a.xAxis.length>6||window.detectmob()?"auto":0},axisTick:{show:!1,interval:0},nameGap:10,boundaryGap:!1,data:m(a.xAxis)},{type:"category",axisLabel:{show:!1},axisTick:{show:!1},boundaryGap:!1,data:a.xAxis}],series:_.map(_.reverse(a.data),function(a){return{name:a.name,xAxisIndex:0,stack:"总量",itemStyle:{emphasis:{shadowColor:"rgba(0,0,0,.5)"}},areaStyle:{normal:{}},type:"line",smooth:!1,data:a.data}})})}var d=this;$.extend(d._params,b||{}),e.get(g.cutDirtyParams($.extend(!0,{},l,{content:"detail",chart:"circulation_group_by_week_and_from"},d._params)),function(b){b.crawled_at&&(a.updateDate=moment(b.crawled_at).format("YYYY-MM-DD")),d.data=g.chartDataPrune(b.stat),c()})};var t=a.weekRateChart={chartOptions:{},yAxisFormat:"percent2",yAxis:"rate",_filters:[{name:"期限：",options:[{name:"1M",value:1},{name:"3M",value:3},{name:"6M",value:6},{name:"1Y",value:12},{name:"2Y",value:24}]}],_getParamName:function(a){return _.find(this._filters[a].options,{value:this._params.life}).name},_params:{life:6},xAxisFormat:null,list:[]};t.updateDataView=function(a){function b(){var a=c.data,b=_.map(a.data,"name"),d=g.chartOptions("#weekRateChart",b);c.chartOptions=$.extend(!0,{},r,d,{legend:{data:b},tooltip:{axisPointer:{axis:"auto",type:"line"},titleFormat:"@ToWeekEnd",titlexAxisIndex:1,titleSuffix:"收益率",xAxisFormat:c.xAxisFormat,yAxisFormat:c.yAxisFormat},yAxis:{name:"收益率（单位：%）",interval:1,max:g.getAxisMax(a.data),min:0},xAxis:[{type:"category",name:"周",nameLocation:"end",axisLabel:{interval:a.xAxis.length>6||window.detectmob()?"auto":0},axisTick:{show:!1,interval:0},nameGap:10,boundaryGap:!1,data:m(a.xAxis)},{type:"category",axisLabel:{show:!1},axisTick:{show:!1},boundaryGap:!1,data:a.xAxis}],series:_.map(a.data,function(a){return{name:a.name,type:"line",xAxisIndex:0,markLine:{data:g.getMarkLineCoords(a.data)},smooth:!1,data:a.data}})})}var c=this;$.extend(c._params,a||{}),e.get(g.cutDirtyParams($.extend(!0,{},l,{content:"detail",chart:"rate_group_by_week_and_from"},c._params)),function(a){c.data=g.chartDataPrune(a.stat),b()})};var u=a.assetTypePercentChart={chartOptions:{},_params:{},yAxisFormat:"percent2",yAxis:"rate",xAxisFormat:null,list:[]};u.updateDataView=function(a){function b(){var a=c.data,b=_.map(a,"name"),d=g.chartOptions("#assetTypePercentChart",b);c.chartOptions=$.extend(!0,{},r,d,{legend:{data:b},tooltip:{trigger:"item",axisPointer:{axis:"auto",type:"line"},formatter:function(a){var b='<div class="f1_2rem chart-tooltip-title" style="border-bottom: 1px solid rgba(255,255,255,.3);padding-bottom: 5px;margin-bottom:5px;">'+a.data.name+'</div><table class="f1_2rem chart-tooltip-table"><tr><td class="justify">占比：</td><td>'+h(a.data.value,c.yAxisFormat)+"</td></tr>";return b},xAxisFormat:c.xAxisFormat,yAxisFormat:c.yAxisFormat},yAxis:{show:!1},xAxis:{show:!1},grid:{show:!0,top:0,left:0,right:0,bottom:50},series:[{name:"访问来源",type:"pie",radius:"55%",center:["50%","50%"],data:a,itemStyle:{emphasis:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]})}var c=this;$.extend(c._params,a||{}),e.get(g.cutDirtyParams($.extend(!0,{},l,{content:"overview",chart:"circulation_pct"},c._params)),function(a){c.data=g.chartDataToPercent(a.stat),c.data=_.chain(c.data.data).map(function(a){return{name:a.name,value:a.data[0]||0}}).value(),b()})},d.get({instID:c.params.id},function(b){var c=a.inst=b.institution;c.assets=c.assets.split(/[,，]/g),g.listOneLineFilter(c.assets,".init-main-info",260,13,10)}),s.updateDataView(),t.updateDataView(),u.updateDataView(),a.moreTableView=function(a){var b={};i(b),c.go("pano.products."+a,b)};var v={page:1,per_page:10};i(v),f.get($.extend({credit_right_or_eq:"bond"},v),function(b){a.products=b.compass_assets}),f.get($.extend({credit_right_or_eq:"am"},v),function(b){a.products2=b.compass_assets})}])}();
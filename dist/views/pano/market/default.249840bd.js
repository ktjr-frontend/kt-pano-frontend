!function(){"use strict";angular.module("kt.pano").controller("ktMarketCtrl",["$scope","$rootScope","$q","$state","$timeout","$location","ktDataHelper","ktAnalyticsService","ktEchartTheme1",function(a,b,c,d,e,f,g,h,i){function j(a){var b=a.xAxis.length,c=b>1?100/(b-1):50;return{xAxisPositionPercents:_.map(a.xAxis,function(a,d){return b>1?d*c:50}),minWidth:_.floor(c/3),start:0,end:100}}function k(){return{start_at:n.start_at,end_at:n.end_at}}function l(a,b){var c;return $.extend(!0,{},{show:!0,attr:{group:"group1"},styles:{position:"absolute",left:v-1,right:u-1,bottom:x,top:w},onZoom:function(b){if("manual"!==b.triggerType){var d,f,g=a.getOption(),h=g.customDataZoom.xAxisPositionPercents,i=g.xAxis[1],j=_.chain(h).map(function(a,c){return a<=b.end&&a>=b.start?c:null}).filter(function(a){return!_.isNull(a)}).value();j.length?(d=i.data[j[0]],f=moment(i.data[j.pop()]).day(0).add(1,"w").format("YYYY-MM-DD")):(d="-",f="-"),C._params.start_at===d&&C._params.end_at===f||(e.cancel(c),c=e(function(){C.updateDataView({start_at:d,end_at:f},!0),E.updateDataView({start_at:d,end_at:f},!0),ga("send",{hitType:"event",eventCategory:"观察窗窗体",eventAction:"有效拖拽",eventLabel:"市场数据"+("weekAmountChart"===a.getDom().id?"发行量趋势图":"收益率趋势图")})},500))}}},b||{})}var m=a.shared,n=m.params;m.tabActive.tab0=!0,m.filter_show=!0;var o=f.search();$.extend(n,o),g.pruneDirtyParams(n,o,["from","mapped_exchange","asset_type"]),a.updateDate="获取中...",g.filterUpdate(m.filters,m.params);var p=i.color,q="all"===n[n.dimension]||!n[n.dimension],r=10,s={},t=function(a){_.isEmpty(s)&&_.each(a,function(a,b){s[a]=b<r})},u=40,v=65,w=50,x=q?140:80,y=function(a){return _.map(a,function(a){return moment(a).format("MMDD~")+moment(a).weekday(6).format("MMDD")})},z={text:"努力加载中...",color:"#3d4351",textColor:"#3d4351"},A={tooltip:{valueType:"rmb"},toolbox:{show:!1},legend:{left:q?v-25:"center",right:u/2,textStyle:{fontSize:12,color:"#626472"}},yAxis:{nameGap:20,splitLine:{show:!0,lineStyle:{color:["#f3f3f3"],width:1,type:"solid"}}},grid:{show:!0,top:w,left:v,right:u,bottom:x}};"asset_type"===n.dimension&&(A.color=g.getDimentionSpecialColor("asset_type")),a.$watch("weekAmountChart.chartOptions.filterVisible",function(a){_.isUndefined(a)||(ga("send",{hitType:"event",eventCategory:"观察窗按钮",eventAction:a?"打开":"关闭",eventLabel:"市场数据 发行量趋势图"}),a&&b.bdTrack(["市场数据页","打开","资产产品发行量趋势图","观察窗"]))}),a.$watch("weekRateChart.chartOptions.filterVisible",function(a){_.isUndefined(a)||(ga("send",{hitType:"event",eventCategory:"观察窗按钮",eventAction:a?"打开":"关闭",eventLabel:"市场数据 收益率趋势图"}),a&&b.bdTrack(["市场数据页","打开","资产产品收益率趋势图","观察窗"]))});var B=a.weekAmountChart={chartOptions:{},_params:{},xAxis:n.dimension,yAxisFormat:"rmb",yAxis:"amount",xAxisFormat:null,list:[]};B.updateDataView=function(b){function c(){var a=d.echart=echarts.getInstanceByDom($("#weekAmountChart")[0]),b=d.data,c=_.map(b.data,"name");t(c);var e=d.color||A.color||p.slice(0,c.length),f=g.chartOptions("#weekAmountChart",c);d.chartOptions=$.extend(!0,{},A,f,{color:_.reverse(e.slice(0)),legend:{data:c,selected:s},customDataZoom:l(a,$.extend(j(b),{styles:{bottom:f.grid.bottom}})),tooltip:{axisPointer:{axis:"auto",type:"line"},reverse:!0,titlexAxisIndex:1,titleFormat:"@ToWeekEnd",titleSuffix:"发行量",xAxisFormat:d.xAxisFormat,yAxisFormat:d.yAxisFormat},yAxis:{name:"发行量（万元）"},xAxis:[{type:"category",name:"周",nameLocation:"end",axisLabel:{interval:b.xAxis.length>6||window.detectmob()?"auto":0},axisTick:{show:!1,interval:0},nameGap:10,boundaryGap:!1,data:y(b.xAxis)},{type:"category",axisLabel:{show:!1},axisTick:{show:!1},boundaryGap:!1,data:b.xAxis}],series:_.map(_.reverse(b.data),function(a){return{name:a.name,xAxisIndex:0,stack:"总量",itemStyle:{emphasis:{shadowColor:"rgba(0,0,0,.5)"}},areaStyle:{normal:{}},type:"line",smooth:!1,data:a.data}})}),a&&a.hideLoading()}var d=this;$.extend(d._params,b||{}),h.get(g.cutDirtyParams($.extend(!0,{},n,{content:"detail",chart:"circulation_group_by_week_and_from"},d._params)),function(b){b.crawled_at&&(a.updateDate=moment(b.crawled_at).format("YYYY-MM-DD")),d.data=g.chartDataPrune(b.stat),c()})};var C=a.durationAmountChart={chartOptions:{},_params:k(),xAxis:n.dimension,yAxisFormat:"rmb",yAxis:"amount",xAxisFormat:null,list:[]};C.updateDataView=function(a,b){function c(){var a=e.data,b=g.chartOptions("#durationAmountChart",_.map(a.data,"name"));return $.extend(!0,{},A,b,{tooltip:{xAxisFormat:e.xAxisFormat,yAxisFormat:e.yAxisFormat,reverse:!0},yAxis:{name:"发行量（万元）"},xAxis:{type:"category",name:"期限",nameLocation:"end",nameGap:10,boundaryGap:!0,data:g.chartAxisFormat(a.xAxis,"MY")}})}function d(){var a=c(),d=e.data,g=_.map(d.data,"name");t(g);var h=e.color||A.color||p.slice(0,g.length);e.chartOptions=$.extend(!0,{},a,{color:_.reverse(h.slice(0)),legend:{data:g,selected:b?f.getOption().legend[0].selected:s},series:_.map(_.reverse(d.data),function(a){return{name:a.name,itemStyle:{normal:{opacity:.8},emphasis:{barBorderWidth:1,barBorderColor:"rgba(0,0,0,.5)"}},stack:"总量",type:"bar",barWidth:30,data:a.data}})}),f&&f.hideLoading()}var e=this,f=e.echart=echarts.getInstanceByDom($("#durationAmountChart")[0]);$.extend(e._params,a||{}),b&&f&&(f.hideLoading(),f.showLoading(z)),h.get(g.cutDirtyParams($.extend(!0,{},n,{content:"detail",chart:"circulation_group_by_life_days_and_from"},e._params)),function(a){e.data=g.chartDataPrune(a.stat),d()},function(){e.data={data:[],xAxis:[]},d()})};var D=a.weekRateChart={chartOptions:{},xAxis:n.dimension,yAxisFormat:"percent2",yAxis:"rate",_filters:[{name:"期限：",onToggle:function(a){a&&b.bdTrack(["市场数据页","下拉","资产收益率趋势图"])},options:[{name:"1M",value:1},{name:"3M",value:3},{name:"6M",value:6},{name:"1Y",value:12},{name:"2Y",value:24}]}],_getParamName:function(a){return _.find(this._filters[a].options,{value:this._params.life}).name},_params:{life:6},xAxisFormat:null,list:[]};D.updateDataView=function(a,b){function c(){var a=d.data,b=_.map(a.data,"name"),c=d.echart=echarts.getInstanceByDom($("#weekRateChart")[0]);t(b);var f=g.chartOptions("#weekRateChart",b);d.chartOptions=$.extend(!0,{},A,f,{legend:{data:b,selected:s},customDataZoom:l(c,$.extend(j(a),{styles:{bottom:f.grid.bottom}})),tooltip:{axisPointer:{axis:"auto",type:"line"},titleFormat:"@ToWeekEnd",titlexAxisIndex:1,titleSuffix:"收益率",xAxisFormat:d.xAxisFormat,yAxisFormat:d.yAxisFormat},yAxis:{name:"收益率（%）",interval:1,max:g.getAxisMax(a.data),min:0},xAxis:[{type:"category",name:"周",nameLocation:"end",axisLabel:{interval:a.xAxis.length>6||window.detectmob()?"auto":0},axisTick:{show:!1,interval:0},nameGap:10,boundaryGap:!1,data:y(a.xAxis)},{type:"category",axisLabel:{show:!1},axisTick:{show:!1},boundaryGap:!1,data:a.xAxis}],series:_.map(a.data,function(a){return{name:a.name,type:"line",xAxisIndex:0,markLine:{data:g.getMarkLineCoords(a.data)},smooth:!1,data:a.data}})}),e&&e.hideLoading()}var d=this,e=d.echart=echarts.getInstanceByDom($("#weekRateChart")[0]);$.extend(d._params,a||{}),b&&e&&(e.hideLoading(),e.showLoading(z)),h.get(g.cutDirtyParams($.extend(!0,{},n,{content:"detail",chart:"rate_group_by_week_and_from"},d._params)),function(a){d.data=g.chartDataPrune(a.stat),c()})};var E=a.durationRateChart={_params:k(),chartOptions:{},xAxis:n.dimension,yAxisFormat:"percent2",yAxis:"rate",xAxisFormat:null,list:[]};E.updateDataView=function(a,b){function c(){var a=e.data,b=g.chartOptions("#durationRateChart",_.map(a.data,"name"));return $.extend(!0,{},A,b,{tooltip:{axisPointer:{axis:"auto",type:"line"},xAxisFormat:e.xAxisFormat,yAxisFormat:e.yAxisFormat},yAxis:{name:"收益率（%）"},xAxis:{type:"category",name:"期限",nameLocation:"end",nameGap:10,boundaryGap:!1,data:g.chartAxisFormat(a.xAxis,"MY")}})}function d(){var a=e.data,d=c(),h=_.map(a.data,"name");t(h),e.chartOptions=$.extend(!0,{},d,{legend:{data:_.map(a.data,"name"),selected:b?f.getOption().legend[0].selected:s},yAxis:{interval:1,max:g.getAxisMax(a.data),min:0},series:_.map(a.data,function(a){return{name:a.name,type:"line",markLine:{data:g.getMarkLineCoords(a.data)},smooth:!1,data:a.data}})}),f&&f.hideLoading()}var e=this,f=e.echart=echarts.getInstanceByDom($("#durationRateChart")[0]);$.extend(e._params,a||{}),b&&f&&(f.hideLoading(),f.showLoading(z)),h.get(g.cutDirtyParams($.extend(!0,{},n,{content:"detail",chart:"rate_group_by_life_days_and_from"},e._params)),function(a){e.data=g.chartDataPrune(a.stat),d()},function(){e.data={data:[],xAxis:[]},d()})},B.updateDataView(),C.updateDataView(),D.updateDataView(),E.updateDataView()}])}();
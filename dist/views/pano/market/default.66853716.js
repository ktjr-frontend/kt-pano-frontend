!function(){"use strict";angular.module("kt.pano").controller("ktMarketCtrl",["$scope","$q","$state","$timeout","$location","ktDataHelper","ktAnalyticsService","ktEchartTheme1",function(a,b,c,d,e,f,g,h){function i(a){var b=a.xAxis.length,c=b>1?100/(b-1):50,d=_.map(a.xAxis,function(a,d){return b>1?d*c:50});return{xAxisPositionPercents:d,minWidth:_.floor(c/3),start:0,end:100}}function j(){return{start_at:m.start_at,end_at:m.end_at}}function k(a,b){var c;return $.extend(!0,{},{show:!0,attr:{group:"group1"},styles:{position:"absolute",left:u-1,right:t-1,bottom:w,top:v},onZoom:function(b){if("manual"!==b.triggerType){var e,f,g=a.getOption(),h=g.customDataZoom.xAxisPositionPercents,i=g.xAxis[1],j=_.chain(h).map(function(a,c){return a<=b.end&&a>=b.start?c:null}).filter(function(a){return!_.isNull(a)}).value();j.length?(e=i.data[j[0]],f=moment(i.data[j.pop()]).day(0).add(1,"w").format("YYYY-MM-DD")):(e="-",f="-"),B._params.start_at===e&&B._params.end_at===f||(d.cancel(c),c=d(function(){B.updateDataView({start_at:e,end_at:f},!0),D.updateDataView({start_at:e,end_at:f},!0),ga("send",{hitType:"event",eventCategory:"观察窗窗体",eventAction:"有效拖拽",eventLabel:"市场数据"+("weekAmountChart"===a.getDom().id?"发行量趋势图":"收益率趋势图")})},500))}}},b||{})}var l=a.shared,m=l.params,n=e.search();$.extend(m,n),f.pruneDirtyParams(m,n,["from","mapped_exchange","asset_type"]),a.updateDate="获取中...",f.filterUpdate(l.filters,l.params);var o=h.color,p="all"===m[m.dimension]||!m[m.dimension],q=10,r={},s=function(a){_.isEmpty(r)&&_.each(a,function(a,b){r[a]=b<q})},t=40,u=65,v=50,w=p?140:80,x=function(a){return _.map(a,function(a){return moment(a).format("MMDD~")+moment(a).weekday(6).format("MMDD")})},y={text:"努力加载中...",color:"#3d4351",textColor:"#3d4351"},z={tooltip:{valueType:"rmb"},toolbox:{show:!1},legend:{left:p?u-25:"center",right:t/2,textStyle:{fontSize:12,color:"#626472"}},yAxis:{nameGap:20,splitLine:{show:!0,lineStyle:{color:["#f3f3f3"],width:1,type:"solid"}}},grid:{show:!0,top:v,left:u,right:t,bottom:w}};"asset_type"===m.dimension&&(z.color=f.getDimentionSpecialColor("asset_type")),a.$watch("weekAmountChart.chartOptions.filterVisible",function(a){_.isUndefined(a)||ga("send",{hitType:"event",eventCategory:"观察窗按钮",eventAction:a?"打开":"关闭",eventLabel:"市场数据 发行量趋势图"})}),a.$watch("weekRateChart.chartOptions.filterVisible",function(a){_.isUndefined(a)||ga("send",{hitType:"event",eventCategory:"观察窗按钮",eventAction:a?"打开":"关闭",eventLabel:"市场数据 收益率趋势图"})});var A=a.weekAmountChart={chartOptions:{},_params:{},xAxis:m.dimension,yAxisFormat:"rmb",yAxis:"amount",xAxisFormat:null,list:[]};A.updateDataView=function(b){function c(){var a=d.echart=echarts.getInstanceByDom($("#weekAmountChart")[0]),b=d.data,c=_.map(b.data,"name");s(c);var e=d.color||z.color||o.slice(0,c.length),g=f.chartOptions("#weekAmountChart",c);d.chartOptions=$.extend(!0,{},z,g,{color:_.reverse(e.slice(0)),legend:{data:c,selected:r},customDataZoom:k(a,$.extend(i(b),{styles:{bottom:g.grid.bottom}})),tooltip:{axisPointer:{axis:"auto",type:"line"},reverse:!0,titlexAxisIndex:1,titleFormat:"@ToWeekEnd",titleSuffix:"发行量",xAxisFormat:d.xAxisFormat,yAxisFormat:d.yAxisFormat},yAxis:{name:"发行量（万元）"},xAxis:[{type:"category",name:"周",nameLocation:"end",axisLabel:{interval:b.xAxis.length>6||window.detectmob()?"auto":0},axisTick:{show:!1,interval:0},nameGap:10,boundaryGap:!1,data:x(b.xAxis)},{type:"category",axisLabel:{show:!1},axisTick:{show:!1},boundaryGap:!1,data:b.xAxis}],series:_.map(_.reverse(b.data),function(a){return{name:a.name,xAxisIndex:0,stack:"总量",itemStyle:{emphasis:{shadowColor:"rgba(0,0,0,.5)"}},areaStyle:{normal:{}},type:"line",smooth:!1,data:a.data}})}),a&&a.hideLoading()}var d=this;$.extend(d._params,b||{}),g.get(f.cutDirtyParams($.extend(!0,{},m,{content:"detail",chart:"circulation_group_by_week_and_from"},d._params)),function(b){b.crawled_at&&(a.updateDate=moment(b.crawled_at).format("YYYY-MM-DD")),d.data=f.chartDataPrune(b.stat),c()})};var B=a.durationAmountChart={chartOptions:{},_params:j(),xAxis:m.dimension,yAxisFormat:"rmb",yAxis:"amount",xAxisFormat:null,list:[]};B.updateDataView=function(a,b){function c(){var a=e.data,b=f.chartOptions("#durationAmountChart",_.map(a.data,"name"));return $.extend(!0,{},z,b,{tooltip:{xAxisFormat:e.xAxisFormat,yAxisFormat:e.yAxisFormat,reverse:!0},yAxis:{name:"发行量（万元）"},xAxis:{type:"category",name:"期限",nameLocation:"end",nameGap:10,boundaryGap:!0,data:f.chartAxisFormat(a.xAxis,"MY")}})}function d(){var a=c(),d=e.data,f=_.map(d.data,"name");s(f);var g=e.color||z.color||o.slice(0,f.length);e.chartOptions=$.extend(!0,{},a,{color:_.reverse(g.slice(0)),legend:{data:f,selected:b?h.getOption().legend[0].selected:r},series:_.map(_.reverse(d.data),function(a){return{name:a.name,itemStyle:{normal:{opacity:.8},emphasis:{barBorderWidth:1,barBorderColor:"rgba(0,0,0,.5)"}},stack:"总量",type:"bar",barWidth:30,data:a.data}})}),h&&h.hideLoading()}var e=this,h=e.echart=echarts.getInstanceByDom($("#durationAmountChart")[0]);$.extend(e._params,a||{}),b&&h&&(h.hideLoading(),h.showLoading(y)),g.get(f.cutDirtyParams($.extend(!0,{},m,{content:"detail",chart:"circulation_group_by_life_days_and_from"},e._params)),function(a){e.data=f.chartDataPrune(a.stat),d()},function(){e.data={data:[],xAxis:[]},d()})};var C=a.weekRateChart={chartOptions:{},xAxis:m.dimension,yAxisFormat:"percent2",yAxis:"rate",_filters:[{name:"期限：",options:[{name:"1M",value:1},{name:"3M",value:3},{name:"6M",value:6},{name:"1Y",value:12},{name:"2Y",value:24}]}],_getParamName:function(a){return _.find(this._filters[a].options,{value:this._params.life}).name},_params:{life:6},xAxisFormat:null,list:[]};C.updateDataView=function(a,b){function c(){var a=d.data,b=_.map(a.data,"name"),c=d.echart=echarts.getInstanceByDom($("#weekRateChart")[0]);s(b);var g=f.chartOptions("#weekRateChart",b);d.chartOptions=$.extend(!0,{},z,g,{legend:{data:b,selected:r},customDataZoom:k(c,$.extend(i(a),{styles:{bottom:g.grid.bottom}})),tooltip:{axisPointer:{axis:"auto",type:"line"},titleFormat:"@ToWeekEnd",titlexAxisIndex:1,titleSuffix:"收益率",xAxisFormat:d.xAxisFormat,yAxisFormat:d.yAxisFormat},yAxis:{name:"收益率（%）",interval:1,max:f.getAxisMax(a.data),min:0},xAxis:[{type:"category",name:"周",nameLocation:"end",axisLabel:{interval:a.xAxis.length>6||window.detectmob()?"auto":0},axisTick:{show:!1,interval:0},nameGap:10,boundaryGap:!1,data:x(a.xAxis)},{type:"category",axisLabel:{show:!1},axisTick:{show:!1},boundaryGap:!1,data:a.xAxis}],series:_.map(a.data,function(a){return{name:a.name,type:"line",xAxisIndex:0,markLine:{data:f.getMarkLineCoords(a.data)},smooth:!1,data:a.data}})}),e&&e.hideLoading()}var d=this,e=d.echart=echarts.getInstanceByDom($("#weekRateChart")[0]);$.extend(d._params,a||{}),b&&e&&(e.hideLoading(),e.showLoading(y)),g.get(f.cutDirtyParams($.extend(!0,{},m,{content:"detail",chart:"rate_group_by_week_and_from"},d._params)),function(a){d.data=f.chartDataPrune(a.stat),c()})};var D=a.durationRateChart={_params:j(),chartOptions:{},xAxis:m.dimension,yAxisFormat:"percent2",yAxis:"rate",xAxisFormat:null,list:[]};D.updateDataView=function(a,b){function c(){var a=e.data,b=f.chartOptions("#durationRateChart",_.map(a.data,"name"));return $.extend(!0,{},z,b,{tooltip:{axisPointer:{axis:"auto",type:"line"},xAxisFormat:e.xAxisFormat,yAxisFormat:e.yAxisFormat},yAxis:{name:"收益率（%）"},xAxis:{type:"category",name:"期限",nameLocation:"end",nameGap:10,boundaryGap:!1,data:f.chartAxisFormat(a.xAxis,"MY")}})}function d(){var a=e.data,d=c(),g=_.map(a.data,"name");s(g),e.chartOptions=$.extend(!0,{},d,{legend:{data:_.map(a.data,"name"),selected:b?h.getOption().legend[0].selected:r},yAxis:{interval:1,max:f.getAxisMax(a.data),min:0},series:_.map(a.data,function(a){return{name:a.name,type:"line",markLine:{data:f.getMarkLineCoords(a.data)},smooth:!1,data:a.data}})}),h&&h.hideLoading()}var e=this,h=e.echart=echarts.getInstanceByDom($("#durationRateChart")[0]);$.extend(e._params,a||{}),b&&h&&(h.hideLoading(),h.showLoading(y)),g.get(f.cutDirtyParams($.extend(!0,{},m,{content:"detail",chart:"rate_group_by_life_days_and_from"},e._params)),function(a){e.data=f.chartDataPrune(a.stat),d()},function(){e.data={data:[],xAxis:[]},d()})},A.updateDataView(),B.updateDataView(),C.updateDataView(),D.updateDataView()}])}();
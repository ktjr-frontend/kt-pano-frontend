!function(){"use strict";angular.module("kt.common").directive("ktEchart",["$rootScope","ktValueFactory",function(a,b){return{restrict:"A",scope:{chartOptions:"=chartOptions",resizeBy:"=resizeBy"},link:function(c,d,e){function f(a){var b=d.find(".custom-data-zoom");return b.length?void b.css(a.styles||{}).attr(a.attr||{}).find(".zoom-box").css({left:a.start+"%",right:100-a.end+"%"}):(b=$('<div class="custom-data-zoom dn"/>').attr($.extend({id:_.uniqueId("dataZoom")},a.attr||{})).append($('<div class="zoom-box" title="可以拖拽，放大缩小"/>').css({left:a.start+"%",right:100-a.end+"%"})).appendTo(d).css(a.styles||{}).on("zoomUpdate",function(a,b){var c=h.getOption().customDataZoom,d=$(this).find(".zoom-box");d.attr({style:b.styles,"data-x":b.dataX}),c.onZoom&&c.onZoom(b)}),interact(".zoom-box",{context:d[0]}).draggable({inertia:!1,restrict:{restriction:".custom-data-zoom",endOnly:!1,elementRect:{left:0,right:1,top:0,bottom:1}},onmove:function(a){var b=$(a.target),c=(parseFloat(b.attr("data-x"))||0)+a.dx;b.css({transform:"translateX("+c+"px)"}).attr("data-x",c),g(b)}}).on("dragend",function(){}).resizable({preserveAspectRatio:!1,restrict:{restriction:".custom-data-zoom"},edges:{left:!0,right:!0,bottom:!1,top:!1}}).on("resizemove",function(b){var c=$(b.target);if(!(b.rect.width<(a.minWidth*c.parent().width()/100||15))){var d=parseFloat(c.attr("data-x"))||0;d+=b.deltaRect.left,c.css({width:b.rect.width+"px",transform:"translate("+d+"px)"}).attr("data-x",d),g(c)}}).on("resizeend",function(){}),void c.$watch("chartOptions.filterVisible",function(a){a?b.fadeIn():b.fadeOut()}))}function g(a){var b=$(a),c=h.getOption().customDataZoom,d=b.parent(),e=d.width(),f=b.position(),g=d.attr("group"),i={type:"dataZoom",styles:b.attr("style"),dataX:b.attr("data-x"),start:100*_.round(f.left/e,2),end:100*_.round((b.outerWidth()+f.left)/e,2)};g&&$(".custom-data-zoom").filter(function(){return!$(this).is(d)&&$(this).attr("group")===g}).trigger("zoomUpdate",$.extend({triggerType:"manual"},i)),c.onZoom&&(clearTimeout(l),l=setTimeout(function(){c.onZoom(i)},300))}if(!echarts.getInstanceByDom(d[0])){var h=echarts.init(d[0],"theme1"),i=b;c.$watch("resizeBy",function(){setTimeout(function(){h.resize()},50)});var j={tooltip:{trigger:"axis",shadowStyle:{color:"rgba(0,0,0,.1)"},textStyle:{color:"white"},axisPointer:{type:"shadow"},formatter:function(a){if(!_.isArray(a))return"";var b=this.getOption(),c=b.color,d=b.tooltip[0].yAxisFormat,e=b.tooltip[0].reverse,f=b.tooltip[0].titlePrefix||"",g=b.tooltip[0].titleSuffix||"",h=b.tooltip[0].titleFormat||"",j=b.tooltip[0].titlexAxisIndex||0,k=b.tooltip[0].noUnit,l=_.isNumber(a[0].dataIndex)?b.xAxis[j].data[a[0].dataIndex]:a[0].name;c=b.tooltip[0].color||c,e&&(a=_.reverse(a));var m=d.split("|");d&&m.length>1?_.each(m,function(b){var c=b.match(/{(\d+),(\d+)}/);c&&_.each(a,function(a){_.inRange(a.seriesIndex,parseInt(c[1],10),parseInt(c[2],10)+1)&&(a.yAxisFormat=b.replace(/{\d+,\d+}/g,""))})}):_.each(a,function(a){a.yAxisFormat=d}),"@ToWeekEnd"===h&&(l+=" ~ "+moment(l).weekday(6).format("YYYY-MM-DD")),l=f+l+g;var n='<div class="f1_2rem chart-tooltip-title" style="border-bottom: 1px solid rgba(255,255,255,.3);padding-bottom: 5px;margin-bottom:5px;">'+l+'</div><table class="f1_2rem chart-tooltip-table">';return n=_.reduce(a,function(a,b){return a+'<tr><td class="justify"><i class="fa-circle fa" style="transform: scale(0.8);color:'+c[b.seriesIndex]+';"></i>'+b.seriesName+'：</td><td class="text-right"><span>'+i(b.data,b.yAxisFormat,k).replace(/^(0万元|0)$/g,"-")+"</span></td></tr>"},n)+"</table>"}.bind(h)},toolbox:{show:!1,orient:"vertical",x:"right",y:"center",feature:{saveAsImage:{show:!0}}},yAxis:{type:"value",boundaryGap:[0,"10%"],axisLabel:{textStyle:{color:"#666b76",fontSize:10},formatter:function(a){var b=this.getOption().tooltip[0].yAxisFormat;return i(a,b).toString().replace(/%|万元|百万|元/g,"")}.bind(h)}},legend:{bottom:10,data:[]},xAxis:{type:"value",axisLabel:{formatter:function(a){var b=this.getOption().tooltip[0].xAxisFormat;return i(a,b)}.bind(h)},data:[]},series:[]},k=$.extend(!0,{},j,c.chartOptions||{});k.group&&(h.group=k.group),$.isPlainObject(k.customDataZoom)&&f(k.customDataZoom),h.setOption(k),h.on("legendselectchanged",function(b){a.$broadcast("legendSelected",{chartId:e.id,target:b.name,targetValue:b.selected[b.name]})}),h.on("click",function(a){var b=h.getOption();b.onclick&&b.onclick.call(h,a)}),h.on("datazoom",function(){var a=c.chartOptions.dataZoom;if(a&&!$.isEmptyObject(a)&&(!$.isArray(a)||a.length)){$.isPlainObject(a)&&(a=[a]);var b=_.toArray(arguments);_.each(a,function(a){$.isFunction(a.onZoom)&&a.onZoom.apply(h,b)})}}),d.data("echart",h),c.$watch("chartOptions",function(a,b){a!==b&&(a&&$.isPlainObject(a.customDataZoom)&&f(a.customDataZoom),h.setOption(_.mergeWith(k,a||{},function(a,b){return _.isArray(a)?b:void 0}),!0))}),$(window).on("resize",function(){h.resize()});var l}}}}]).directive("ktEchartLegend",function(){return{restrict:"A",require:"ngModel",link:function(a,b,c,d){b.on("change",function(){var a=$("#"+c.chartId).data("echart"),b={legend:{selected:{}}};setTimeout(function(){b.legend.selected[c.name]=d.$modelValue,a&&a.setOption(b)},10)}),a.$on("legendSelected",function(a,b){c.name===b.target&&c.chartId===b.chartId&&(d.$setViewValue(b.targetValue),d.$render())})}}}).directive("ktCanvasToImage",function(){var a="images/logo-pano-watermark.572f1c15.png";return{restrict:"EA",scope:{canvasParent:"@",imageTitle:"=",updateTime:"@",watermark:"@",onClick:"&"},link:function(b,c,d){a=b.watermark||a;var e=new Image,f=0,g=0;e.onload=function(){f=e.naturalWidth,g=e.naturalHeight},e.src=a,c.on("click",function(){var a=$(b.canvasParent).find("canvas")[0],c=a.toDataURL("image/png"),d=new Image,e=document.createElement("canvas"),f=b.updateTime||moment().format("yyyy-MM-dd");d.onload=function(){var a=window.devicePixelRatio||window.webkitDevicePixelRatio||window.mozDevicePixelRatio||window.msDevicePixelRatio,c=1===a?50:100,g=1===a?10:20,h=e.width=this.naturalWidth+2*c,i=e.height=this.naturalHeight+2*c,j=e.getContext("2d");j.fillStyle="#f3f5f8",j.fillRect(0,0,h,i),j.fillStyle="white",j.fillRect(c,c,this.naturalWidth,this.naturalHeight),j.drawImage(d,c,c),j.font=1===a?"14px 微软雅黑":"25px 微软雅黑",j.fillStyle="#868a93",j.textAlign="right",j.textBaseline="top",j.fillText("数据来源：开通金融 PANO",this.naturalWidth+c,this.naturalHeight+c+g),b.imageTitle&&(j.font=1===a?"20px 微软雅黑":"40px 微软雅黑",j.fillStyle="#3e4350",j.textAlign="left",j.textBaseline="bottom",j.fillText(b.imageTitle,c,c-g),j.font=1===a?"14px 微软雅黑":"25px 微软雅黑",j.fillStyle="#868a93",j.textAlign="right",j.fillText("更新时间："+f,this.naturalWidth+c,c-g));var k=e.toDataURL("image/png"),l=document.createElement("a");l.setAttribute("download",b.imageTitle+"（更新时间："+f+"）.png"),l.setAttribute("href",k),l.click(),b.onClick()},d.src=c})}}})}();
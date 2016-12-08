!function(){"use strict";angular.module("kt.common").factory("ktEchartTheme1",["$rootScope","$filter",function(a,b){var c=a.chartColors||["#A3A3A3","#87cefa","#da70d6","#32cd32","#6495ed","#ff69b4","#ba55d3","#cd5c5c","#ffa500","#40e0d0","#1e90ff","#ff6347","#7b68ee","#00fa9a","#ffd700","#6699FF","#ff6666","#3cb371","#b8860b","#30e0e0"],d=function(a,c){var d=b("ktNumberLocate");switch(c){case"percent":return(100*a).toFixed(2)+"%";case"rmb":return d(a);default:return a.toFixed(2)}};return{color:c,title:{x:"left",y:"top",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,textStyle:{fontSize:18,fontWeight:"bolder",color:"#333"},subtextStyle:{color:"#aaa"}},legend:{orient:"horizontal",x:"center",y:"bottom",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:35,itemWidth:10,itemHeight:12,textStyle:{color:"#626472"}},dataRange:{orient:"vertical",x:"left",y:"bottom",backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,itemWidth:20,itemHeight:14,splitNumber:5,color:["#1e90ff","#f0ffff"],textStyle:{color:"#333"}},toolbox:{orient:"horizontal",x:"right",y:"top",color:["#1e90ff","#22bb22","#4b0082","#d2691e"],backgroundColor:"rgba(0,0,0,0)",borderColor:"#ccc",borderWidth:0,padding:5,itemGap:10,itemSize:16,featureImageIcon:{},featureTitle:{mark:"辅助线开关",markUndo:"删除辅助线",markClear:"清空辅助线",dataZoom:"区域缩放",dataZoomReset:"区域缩放后退",dataView:"数据视图",lineChart:"折线图切换",barChart:"柱形图切换",restore:"还原",saveAsImage:"保存为图片"}},tooltip:{trigger:"item",showDelay:20,hideDelay:100,transitionDuration:.4,backgroundColor:"rgba(255,255,255,.9)",borderColor:"#6c76f4",borderRadius:2,borderWidth:1,padding:10,axisPointer:{type:"line",lineStyle:{color:"#6c76f4",width:1,type:"solid"},shadowStyle:{width:"auto",color:"rgba(150,150,150,0.1)"}},textStyle:{fontSize:13,fontFamily:"微软雅黑",color:"#6c76f4"},formatter:function(a,b,e){for(var f=this._option.tooltip.valueType,g='<span class="fb">'+a[0].name+"</span>",h=0,i=a.length;h<i;h++)g+='<br/><strong style="color: '+c[a[h].seriesIndex]+';">'+a[h].seriesName+" : "+d(a[h].value,f)+"</strong>";return g}},dataZoom:{orient:"horizontal",backgroundColor:"rgba(0,0,0,0)",dataBackgroundColor:"#eee",fillerColor:"rgba(144,197,237,0.2)",handleColor:"rgba(70,130,180,0.8)"},grid:{y:50,x:80,x2:60,y2:80,borderWidth:0,backgroundColor:"rgba(231,234,241,0.3)"},categoryAxis:{position:"bottom",nameLocation:"end",boundaryGap:!0,axisLine:{show:!1,lineStyle:{color:"#afb7d0",width:1,type:"solid"}},axisTick:{show:!0,interval:"auto",inside:!1,length:5,lineStyle:{color:"#afb7d0",width:1}},axisLabel:{show:!0,interval:"auto",rotate:0,margin:8,textStyle:{color:"#6b708f"}},splitLine:{show:!1,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},valueAxis:{position:"left",nameLocation:"end",nameTextStyle:{},boundaryGap:[0,0],splitNumber:5,axisLine:{show:!1,lineStyle:{color:"#48b",width:2,type:"solid"}},axisTick:{show:!1,inside:!1,length:5,lineStyle:{color:"#afb7d0",width:1}},axisLabel:{show:!0,rotate:0,margin:8,formatter:function(a){var b=this._option.tooltip.valueType;return d(a,b)},textStyle:{color:"#6b708f"}},splitLine:{show:!1,lineStyle:{color:["#ccc"],width:1,type:"solid"}},splitArea:{show:!1,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}}},polar:{center:["50%","50%"],radius:"75%",startAngle:90,splitNumber:5,name:{show:!0,textStyle:{color:"#333"}},axisLine:{show:!0,lineStyle:{color:"#ccc",width:1,type:"solid"}},axisLabel:{show:!1,textStyle:{color:"#333"}},splitArea:{show:!0,areaStyle:{color:["rgba(250,250,250,0.3)","rgba(200,200,200,0.3)"]}},splitLine:{show:!0,lineStyle:{width:1,color:"#ccc"}}},bar:{barMinHeight:0,barGap:"30%",barCategoryGap:"20%",itemStyle:{normal:{barBorderColor:"#fff",barBorderRadius:0,barBorderWidth:0,label:{show:!1}},emphasis:{barBorderColor:"rgba(0,0,0,0)",barBorderRadius:0,barBorderWidth:1,label:{show:!1}}}},line:{itemStyle:{normal:{label:{show:!1},lineStyle:{width:2,type:"solid",shadowColor:"rgba(0,0,0,0)",shadowBlur:5,shadowOffsetX:3,shadowOffsetY:3}},emphasis:{label:{show:!1}}},smooth:!0,symbol:"emptyCircle",symbolSize:3,showAllSymbol:!1},k:{itemStyle:{normal:{color:"#fff",color0:"#00aa11",lineStyle:{width:1,color:"#ff3200",color0:"#00aa11"}},emphasis:{}}},scatter:{symbolSize:4,large:!1,largeThreshold:2e3,itemStyle:{normal:{label:{show:!1}},emphasis:{label:{show:!1}}}},radar:{itemStyle:{normal:{label:{show:!1},lineStyle:{width:2,type:"solid"}},emphasis:{label:{show:!1}}},symbolSize:2},pie:{center:["50%","50%"],radius:[0,"75%"],clockWise:!1,startAngle:90,minAngle:0,selectedOffset:10,itemStyle:{normal:{borderColor:"#fff",borderWidth:1,label:{show:!0,position:"outer"},labelLine:{show:!0,length:20,lineStyle:{width:1,type:"solid"}}},emphasis:{borderColor:"rgba(0,0,0,0)",borderWidth:1,label:{show:!1},labelLine:{show:!1,length:20,lineStyle:{width:1,type:"solid"}}}}},map:{mapType:"china",mapLocation:{x:"center",y:"center"},showLegendSymbol:!0,itemStyle:{normal:{borderColor:"#fff",borderWidth:1,areaStyle:{color:"#ccc"},label:{show:!1,textStyle:{color:"rgba(139,69,19,1)"}}},emphasis:{borderColor:"rgba(0,0,0,0)",borderWidth:1,areaStyle:{color:"rgba(255,215,0,0.8)"},label:{show:!1,textStyle:{color:"rgba(139,69,19,1)"}}}}},force:{minRadius:10,maxRadius:20,density:1,attractiveness:1,initSize:300,centripetal:1,coolDown:.99,itemStyle:{normal:{label:{show:!1},nodeStyle:{brushType:"both",color:"#f08c2e",strokeColor:"#5182ab"},linkStyle:{strokeColor:"#5182ab"}},emphasis:{label:{show:!1},nodeStyle:{},linkStyle:{}}}},chord:{radius:["65%","75%"],center:["50%","50%"],padding:2,sort:"none",sortSub:"none",startAngle:90,clockWise:!1,showScale:!1,showScaleText:!1,itemStyle:{normal:{label:{show:!0},lineStyle:{width:0,color:"#000"},chordStyle:{lineStyle:{width:1,color:"#666"}}},emphasis:{lineStyle:{width:0,color:"#000"},chordStyle:{lineStyle:{width:2,color:"#333"}}}}},island:{r:15,calculateStep:.1},markPoint:{symbol:"pin",symbolSize:10,itemStyle:{normal:{borderWidth:2,label:{show:!0,position:"inside"}},emphasis:{label:{show:!0}}}},markLine:{symbol:["circle","arrow"],symbolSize:[2,4],itemStyle:{normal:{borderWidth:2,label:{show:!1,position:"inside",textStyle:{color:"#333"}},lineStyle:{type:"solid",shadowColor:"rgba(0,0,0,0)",shadowBlur:5,shadowOffsetX:3,shadowOffsetY:3}},emphasis:{label:{show:!1},lineStyle:{}}}},textStyle:{decoration:"none",fontFamily:"Arial, Verdana, sans-serif",fontFamily2:"微软雅黑",fontSize:12,fontStyle:"normal",fontWeight:"normal"},symbolList:["circle","rectangle","triangle","diamond","emptyCircle","emptyRectangle","emptyTriangle","emptyDiamond"],loadingText:"Loading...",calculable:!1,calculableColor:"rgba(255,165,0,0.6)",calculableHolderColor:"#ccc",nameConnector:" & ",valueConnector:" : ",animation:!0,animationThreshold:2500,addDataAnimation:!0,animationDuration:2e3,animationEasing:"ExponentialOut"}}])}();
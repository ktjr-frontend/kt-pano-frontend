!function(a){function b(a){this.mode=l.MODE_8BIT_BYTE,this.data=a,this.parsedData=[];for(var b=0,c=this.data.length;c>b;b++){var d=[],e=this.data.charCodeAt(b);e>65536?(d[0]=240|(1835008&e)>>>18,d[1]=128|(258048&e)>>>12,d[2]=128|(4032&e)>>>6,d[3]=128|63&e):e>2048?(d[0]=224|(61440&e)>>>12,d[1]=128|(4032&e)>>>6,d[2]=128|63&e):e>128?(d[0]=192|(1984&e)>>>6,d[1]=128|63&e):d[0]=e,this.parsedData.push(d)}this.parsedData=Array.prototype.concat.apply([],this.parsedData),this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function c(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function d(a,b){if(void 0==a.length)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function e(a,b){this.totalCount=a,this.dataCount=b}function f(){this.buffer=[],this.length=0}function g(){return"undefined"!=typeof CanvasRenderingContext2D}function h(){var a=!1,b=navigator.userAgent;if(/android/i.test(b)){a=!0;var c=b.toString().match(/android ([0-9]\.[0-9])/i);c&&c[1]&&(a=parseFloat(c[1]))}return a}function i(a,b){for(var c=1,d=j(a),e=0,f=r.length;f>=e;e++){var g=0;switch(b){case m.L:g=r[e][0];break;case m.M:g=r[e][1];break;case m.Q:g=r[e][2];break;case m.H:g=r[e][3]}if(g>=d)break;c++}if(c>r.length)throw new Error("Too long data");return c}function j(a){var b=encodeURI(a).toString().replace(/\%[0-9a-fA-F]{2}/g,"a");return b.length+(b.length!=a?3:0)}var k;b.prototype={getLength:function(a){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;c>b;b++)a.put(this.parsedData[b],8)}},c.prototype={addData:function(a){var c=new b(a);this.dataList.push(c),this.dataCache=null},isDark:function(a,b){if(0>a||this.moduleCount<=a||0>b||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,b){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,b),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=c.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,b)},setupPositionProbePattern:function(a,b){for(var c=-1;7>=c;c++)if(!(-1>=a+c||this.moduleCount<=a+c))for(var d=-1;7>=d;d++)-1>=b+d||this.moduleCount<=b+d||(c>=0&&6>=c&&(0==d||6==d)||d>=0&&6>=d&&(0==c||6==c)||c>=2&&4>=c&&d>=2&&4>=d?this.modules[a+c][b+d]=!0:this.modules[a+c][b+d]=!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;8>c;c++){this.makeImpl(!0,c);var d=o.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c),e=1;this.make();for(var f=0;f<this.modules.length;f++)for(var g=f*e,h=0;h<this.modules[f].length;h++){var i=h*e,j=this.modules[f][h];j&&(d.beginFill(0,100),d.moveTo(i,g),d.lineTo(i+e,g),d.lineTo(i+e,g+e),d.lineTo(i,g+e),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=a%2==0);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b]&&(this.modules[6][b]=b%2==0)},setupPositionAdjustPattern:function(){for(var a=o.getPatternPosition(this.typeNumber),b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(null==this.modules[d][e])for(var f=-2;2>=f;f++)for(var g=-2;2>=g;g++)-2==f||2==f||-2==g||2==g||0==f&&0==g?this.modules[d+f][e+g]=!0:this.modules[d+f][e+g]=!1}},setupTypeNumber:function(a){for(var b=o.getBCHTypeNumber(this.typeNumber),c=0;18>c;c++){var d=!a&&1==(b>>c&1);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;18>c;c++){var d=!a&&1==(b>>c&1);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=o.getBCHTypeInfo(c),e=0;15>e;e++){var f=!a&&1==(d>>e&1);6>e?this.modules[e][8]=f:8>e?this.modules[e+1][8]=f:this.modules[this.moduleCount-15+e][8]=f}for(var e=0;15>e;e++){var f=!a&&1==(d>>e&1);8>e?this.modules[8][this.moduleCount-e-1]=f:9>e?this.modules[8][15-e-1+1]=f:this.modules[8][15-e-1]=f}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,f=0,g=this.moduleCount-1;g>0;g-=2)for(6==g&&g--;;){for(var h=0;2>h;h++)if(null==this.modules[d][g-h]){var i=!1;f<a.length&&(i=1==(a[f]>>>e&1));var j=o.getMask(b,d,g-h);j&&(i=!i),this.modules[d][g-h]=i,e--,-1==e&&(f++,e=7)}if(d+=c,0>d||this.moduleCount<=d){d-=c,c=-c;break}}}},c.PAD0=236,c.PAD1=17,c.createData=function(a,b,d){for(var g=e.getRSBlocks(a,b),h=new f,i=0;i<d.length;i++){var j=d[i];h.put(j.mode,4),h.put(j.getLength(),o.getLengthInBits(j.mode,a)),j.write(h)}for(var k=0,i=0;i<g.length;i++)k+=g[i].dataCount;if(h.getLengthInBits()>8*k)throw new Error("code length overflow. ("+h.getLengthInBits()+">"+8*k+")");for(h.getLengthInBits()+4<=8*k&&h.put(0,4);h.getLengthInBits()%8!=0;)h.putBit(!1);for(;;){if(h.getLengthInBits()>=8*k)break;if(h.put(c.PAD0,8),h.getLengthInBits()>=8*k)break;h.put(c.PAD1,8)}return c.createBytes(h,g)},c.createBytes=function(a,b){for(var c=0,e=0,f=0,g=new Array(b.length),h=new Array(b.length),i=0;i<b.length;i++){var j=b[i].dataCount,k=b[i].totalCount-j;e=Math.max(e,j),f=Math.max(f,k),g[i]=new Array(j);for(var l=0;l<g[i].length;l++)g[i][l]=255&a.buffer[l+c];c+=j;var m=o.getErrorCorrectPolynomial(k),n=new d(g[i],m.getLength()-1),p=n.mod(m);h[i]=new Array(m.getLength()-1);for(var l=0;l<h[i].length;l++){var q=l+p.getLength()-h[i].length;h[i][l]=q>=0?p.get(q):0}}for(var r=0,l=0;l<b.length;l++)r+=b[l].totalCount;for(var s=new Array(r),t=0,l=0;e>l;l++)for(var i=0;i<b.length;i++)l<g[i].length&&(s[t++]=g[i][l]);for(var l=0;f>l;l++)for(var i=0;i<b.length;i++)l<h[i].length&&(s[t++]=h[i][l]);return s};for(var l={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},m={L:1,M:0,Q:3,H:2},n={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},o={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;o.getBCHDigit(b)-o.getBCHDigit(o.G15)>=0;)b^=o.G15<<o.getBCHDigit(b)-o.getBCHDigit(o.G15);return(a<<10|b)^o.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;o.getBCHDigit(b)-o.getBCHDigit(o.G18)>=0;)b^=o.G18<<o.getBCHDigit(b)-o.getBCHDigit(o.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return o.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case n.PATTERN000:return(b+c)%2==0;case n.PATTERN001:return b%2==0;case n.PATTERN010:return c%3==0;case n.PATTERN011:return(b+c)%3==0;case n.PATTERN100:return(Math.floor(b/2)+Math.floor(c/3))%2==0;case n.PATTERN101:return b*c%2+b*c%3==0;case n.PATTERN110:return(b*c%2+b*c%3)%2==0;case n.PATTERN111:return(b*c%3+(b+c)%2)%2==0;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new d([1],0),c=0;a>c;c++)b=b.multiply(new d([1,p.gexp(c)],0));return b},getLengthInBits:function(a,b){if(b>=1&&10>b)switch(a){case l.MODE_NUMBER:return 10;case l.MODE_ALPHA_NUM:return 9;case l.MODE_8BIT_BYTE:return 8;case l.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(27>b)switch(a){case l.MODE_NUMBER:return 12;case l.MODE_ALPHA_NUM:return 11;case l.MODE_8BIT_BYTE:return 16;case l.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(41>b))throw new Error("type:"+b);switch(a){case l.MODE_NUMBER:return 14;case l.MODE_ALPHA_NUM:return 13;case l.MODE_8BIT_BYTE:return 16;case l.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;b>d;d++)for(var e=0;b>e;e++){for(var f=0,g=a.isDark(d,e),h=-1;1>=h;h++)if(!(0>d+h||d+h>=b))for(var i=-1;1>=i;i++)0>e+i||e+i>=b||0==h&&0==i||g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;b-1>d;d++)for(var e=0;b-1>e;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,0!=j&&4!=j||(c+=3)}for(var d=0;b>d;d++)for(var e=0;b-6>e;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;b>e;e++)for(var d=0;b-6>d;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;b>e;e++)for(var d=0;b>d;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=10*l}},p={glog:function(a){if(1>a)throw new Error("glog("+a+")");return p.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;a>=256;)a-=255;return p.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},q=0;8>q;q++)p.EXP_TABLE[q]=1<<q;for(var q=8;256>q;q++)p.EXP_TABLE[q]=p.EXP_TABLE[q-4]^p.EXP_TABLE[q-5]^p.EXP_TABLE[q-6]^p.EXP_TABLE[q-8];for(var q=0;255>q;q++)p.LOG_TABLE[p.EXP_TABLE[q]]=q;d.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),c=0;c<this.getLength();c++)for(var e=0;e<a.getLength();e++)b[c+e]^=p.gexp(p.glog(this.get(c))+p.glog(a.get(e)));return new d(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=p.glog(this.get(0))-p.glog(a.get(0)),c=new Array(this.getLength()),e=0;e<this.getLength();e++)c[e]=this.get(e);for(var e=0;e<a.getLength();e++)c[e]^=p.gexp(p.glog(a.get(e))+b);return new d(c,0).mod(a)}},e.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],e.getRSBlocks=function(a,b){var c=e.getRsBlockTable(a,b);if(void 0==c)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=c.length/3,f=[],g=0;d>g;g++)for(var h=c[3*g+0],i=c[3*g+1],j=c[3*g+2],k=0;h>k;k++)f.push(new e(i,j));return f},e.getRsBlockTable=function(a,b){switch(b){case m.L:return e.RS_BLOCK_TABLE[4*(a-1)+0];case m.M:return e.RS_BLOCK_TABLE[4*(a-1)+1];case m.Q:return e.RS_BLOCK_TABLE[4*(a-1)+2];case m.H:return e.RS_BLOCK_TABLE[4*(a-1)+3];default:return}},f.prototype={get:function(a){var b=Math.floor(a/8);return 1==(this.buffer[b]>>>7-a%8&1)},put:function(a,b){for(var c=0;b>c;c++)this.putBit(1==(a>>>b-c-1&1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var r=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],s=function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){function b(a,b){var c=document.createElementNS("http://www.w3.org/2000/svg",a);for(var d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return c}var c=this._htOption,d=this._el,e=a.getModuleCount();Math.floor(c.width/e),Math.floor(c.height/e);this.clear();var f=b("svg",{viewBox:"0 0 "+String(e)+" "+String(e),width:"100%",height:"100%",fill:c.colorLight});f.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),d.appendChild(f),f.appendChild(b("rect",{fill:c.colorLight,width:"100%",height:"100%"})),f.appendChild(b("rect",{fill:c.colorDark,width:"1",height:"1",id:"template"}));for(var g=0;e>g;g++)for(var h=0;e>h;h++)if(a.isDark(g,h)){var i=b("use",{x:String(h),y:String(g)});i.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),f.appendChild(i)}},a.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},a}(),t="svg"===document.documentElement.tagName.toLowerCase(),u=t?s:g()?function(){function a(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}function b(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&c._fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};return d.onabort=e,d.onerror=e,d.onload=f,void(d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")}c._bSupportDataURI===!0&&c._fSuccess?c._fSuccess.call(c):c._bSupportDataURI===!1&&c._fFail&&c._fFail.call(c)}if(this._android&&this._android<=2.1){var c=1/window.devicePixelRatio,d=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,b,e,f,g,h,i,j,k){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*c;else"undefined"==typeof j&&(arguments[1]*=c,arguments[2]*=c,arguments[3]*=c,arguments[4]*=c);d.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=h(),this._htOption=b,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=b.width,this._elCanvas.height=b.height,a.appendChild(this._elCanvas),this._el=a,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.alt="Scan me!",this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return e.prototype.draw=function(a){var b=this._elImage,c=this._oContext,d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e,h=Math.round(f),i=Math.round(g);b.style.display="none",this.clear();for(var j=0;e>j;j++)for(var k=0;e>k;k++){var l=a.isDark(j,k),m=k*f,n=j*g;c.strokeStyle=l?d.colorDark:d.colorLight,c.lineWidth=1,c.fillStyle=l?d.colorDark:d.colorLight,c.fillRect(m,n,f,g),c.strokeRect(Math.floor(m)+.5,Math.floor(n)+.5,h,i),c.strokeRect(Math.ceil(m)-.5,Math.ceil(n)-.5,h,i)}this._bIsPainted=!0},e.prototype.makeImage=function(){this._bIsPainted&&b.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){for(var b=this._htOption,c=this._el,d=a.getModuleCount(),e=Math.floor(b.width/d),f=Math.floor(b.height/d),g=['<table style="border:0;border-collapse:collapse;">'],h=0;d>h;h++){g.push("<tr>");for(var i=0;d>i;i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(a.isDark(h,i)?b.colorDark:b.colorLight)+';"></td>');g.push("</tr>")}g.push("</table>"),c.innerHTML=g.join("");var j=c.childNodes[0],k=(b.width-j.offsetWidth)/2,l=(b.height-j.offsetHeight)/2;k>0&&l>0&&(j.style.margin=l+"px "+k+"px")},a.prototype.clear=function(){this._el.innerHTML=""},a}();k=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:m.H},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];"string"==typeof a&&(a=document.getElementById(a)),this._htOption.useSVG&&(u=s),this._android=h(),this._el=a,this._oQRCode=null,this._oDrawing=new u(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)},k.prototype.makeCode=function(a){this._oQRCode=new c(i(a,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(a),this._oQRCode.make(),this._el.title=a,this._oDrawing.draw(this._oQRCode),this.makeImage()},k.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},k.prototype.clear=function(){this._oDrawing.clear()},k.CorrectLevel=m,a.QRCode=k}(this),function(){"use strict";angular.module("kt.common").directive("ktQrCode",["ktCaptcha",function(a){return{restrict:"A",scope:{qrcode:"=qrcode"},link:function(a,b,c){var d={text:"http://jindo.dev.naver.com/collie",width:128,height:128,colorDark:"#000000",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H};a.$watch("qrcode.settings",function(e){a.qrcode.inst=new QRCode(b[0],$.extend(!0,{},d,e,c))})}}}])}();
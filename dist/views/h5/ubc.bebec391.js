!function(a,b){function c(){var a=navigator.userAgent.toLowerCase();return!!a.match(/Android.*MicroMessenger/i)}b.addEventListener("DOMContentLoaded",function(){c()&&b.querySelector("html").classList.add("weixin");var a=location.href.match(/t=(.*)/),d=location.href.match(/s=(\d)/),e=a?a[1]:"",f=d?d[1]:"",g="",h=b.querySelector(".container"),i=b.querySelector(".business-card-preview img"),j=b.querySelector("#file"),k=b.forms.namedItem("uploadBusinessCardForm"),l=b.querySelector("#doneBtn"),m=b.querySelector("#reUploadBtn"),n=new XMLHttpRequest;l.addEventListener("click",function(a){a.preventDefault();var b=new FormData(k);b.append("token",e),"1"===f?n.open("POST","/api/v1/back_cards",!0):n.open("POST","/api/v1/cards",!0),n.onload=function(a){var b=JSON.parse(a.currentTarget.responseText);201===n.status?(g=b.card_url,i.src=g,h.classList.remove("preview"),l.classList.remove("pending"),h.classList.add("done"),this.disabled=!1):(l.disabled=!1,l.innerHTML="完成",l.classList.remove("pending"),alert(b.error||"抱歉服务器繁忙，稍后重试！"))},this.disabled=!0,this.innerHTML='上传中<i class="dotting"></i>',this.classList.add("pending"),n.send(b)}),m.addEventListener("click",function(a){a.preventDefault(),g="",h.classList.remove("preview"),l.disabled=!1,l.innerHTML="完成",n.abort(),k.reset()}),j.addEventListener("change",function(a){var b=new FileReader;b.addEventListener("load",function(){i.src=b.result,j.disabled=!1,h.classList.remove("preparing"),h.classList.add("preview")}),j.files[0]&&(j.disabled=!0,h.classList.add("preparing"),setTimeout(function(){b.readAsDataURL(j.files[0])},50)),a.preventDefault()})})}(window,document);
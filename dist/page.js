!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var o=function(e){return document.querySelector('.footdef a[href="#'+e.getAttribute("id")+'"]').closest(".footdef")},r=function(e){var t=0,n=0;do{t+=e.offsetTop||0,n+=e.offsetLeft||0,e=e.offsetParent}while(e);return{top:t,left:n}},i=function(e){var t=document.querySelector(e);t&&t.remove()},u=function(e){return new Promise((function(t,n){var o=new XMLHttpRequest;o.addEventListener("load",(function(e){var n=this.responseText;try{n=JSON.parse(n)}catch(e){}t(n)})),o.addEventListener("error",n),o.open("GET",e),o.setRequestHeader("Accept","application/vnd.github.v3.html+json"),o.send()}))},c=function(e){return'<div class="comment">\n    <div class="comment-photo"><img src="'+e.user.avatar_url+'" /></div>\n    <div class="comment-right">\n      <div class="comment-header"><b>'+e.user.login+'</b></div>\n      <hr />\n      <div class="body">'+e.body_html+"</div>\n    </div>\n   </div>"};window.innerWidth>=1024&&window.addEventListener("load",(function(){console.log("repositioning footnotes..."),function(e){for(var t,n=0,u=0,c=Array.from(e);u<c.length;u++){var s=c[u],d=o(s),l=r(s).top;console.log("assigning ",s," to ",d),d.classList.add("footnote-definition"),t=l>n?l:n,d.style.top=t+"px",n=t+d.scrollHeight}i("h2.footnotes")}(document.getElementsByClassName("footref"))})),document.addEventListener("scroll",(function e(){if(window.innerHeight+window.scrollY>=document.body.offsetHeight>>1){console.log("loading comments...");var t=document.querySelector("div.comments-container"),n=["data-github-user","data-issues-url","data-issue-id"].map((function(e){return t.getAttribute(e)})),o=n[0],r=n[1],i=n[2];!function(e,t,n,o){(function(e){return u(e).then((function(e){return e.find((function(e){return e.title===o}))}))})(n+"?created="+t).then((function(t){var n=t.html_url,o=t.comments_url;return u(o).then((function(e){return e.map(c)})).then((function(t){return t.forEach((function(t){return e.insertAdjacentHTML("afterend",t)})),e.style.display="block",t.length})).then((function(e){var t=document.querySelector("a#comment-howto-link");t&&t.setAttribute("href",n)}))})).catch((function(e){return console.error("An error occurred while loading comments: ",e)}))}(t,o,r,i),document.removeEventListener("scroll",e)}}))}]);
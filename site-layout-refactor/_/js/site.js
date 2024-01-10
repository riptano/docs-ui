!function(){"use strict";var e=document.querySelector("aside.toc.sidebar");if(e){if(document.querySelector("body.-toc"))return e.parentNode.removeChild(e);var t=parseInt(e.dataset.levels||2,10);if(!(t<0)){for(var n="article.doc",r=document.querySelector(n),o=[],i=0;i<=t;i++){var a=[n];if(i){for(var s=1;s<=i;s++)a.push((2===s?".sectionbody>":"")+".sect"+s);a.push("h"+(i+1)+"[id]")}else a.push("h1[id].sect0");o.push(a.join(">"))}p=o.join(","),u=r.parentNode;var d,c=[].slice.call((u||document).querySelectorAll(p));if(!c.length)return e.parentNode.removeChild(e);var l={},m=c.reduce(function(e,t){var n=document.createElement("a"),o=(n.textContent=t.textContent,l[n.href="#"+t.id]=n,document.createElement("li")),t=parseInt(t.nodeName.slice(1),10)-1;return o.dataset.level=t,o.className="!m-0",n.className=`block py-1 pr-1 !no-underline !text-secondary 
      hover:!text-link [&.is-active]:!text-link[&.is-active]:border-[var(--ds-primary-main)] border-l-2`,1==t&&n.classList.add("pl-2","text-button"),2==t&&n.classList.add("pl-4","!text-tertiary"),3==t&&n.classList.add("pl-6","!text-tertiary"),o.appendChild(n),e.appendChild(o),e},document.createElement("ul")),u=(m.className="!p-0 !m-0 !list-none",e.querySelector(".toc-menu")),p=(u||((u=document.createElement("div")).className="toc-menu"),document.createElement("h3")),e=(p.className="!my-2 text-h3 text-primary",p.textContent=e.dataset.title||"Contents",u.appendChild(p),u.appendChild(m),!document.getElementById("toc")&&r.querySelector("h1.page ~ :not(.is-before-toc)"));e&&((p=document.createElement("aside")).className="mb-6 toc embedded xl:hidden",p.appendChild(u.cloneNode(!0)),e.parentNode.insertBefore(p,e)),window.addEventListener("load",function(){f(),window.addEventListener("scroll",f)})}}function f(){var o,i,t,e=window.pageYOffset,n=1.15*h(document.documentElement,"fontSize"),a=r.offsetTop;e&&window.innerHeight+e+2>=document.documentElement.scrollHeight?(d=Array.isArray(d)?d:Array(d||0),o=[],i=c.length-1,c.forEach(function(e,t){var n="#"+e.id;t===i||e.getBoundingClientRect().top+h(e,"paddingTop")>a?(o.push(n),d.indexOf(n)<0&&l[n].classList.add("is-active")):~d.indexOf(n)&&l[d.shift()].classList.remove("is-active")}),m.scrollTop=m.scrollHeight-m.offsetHeight,d=1<o.length?o:o[0]):(Array.isArray(d)&&(d.forEach(function(e){l[e].classList.remove("is-active")}),d=void 0),c.some(function(e){if(e.getBoundingClientRect().top+h(e,"paddingTop")-n>a)return!0;t="#"+e.id}),t?t!==d&&(d&&l[d].classList.remove("is-active"),(e=l[t]).classList.add("is-active"),m.scrollHeight>m.offsetHeight&&(m.scrollTop=Math.max(0,e.offsetTop+e.offsetHeight-m.offsetHeight)),d=t):d&&(l[d].classList.remove("is-active"),d=void 0))}function h(e,t){return parseFloat(window.getComputedStyle(e)[t])}}();
!function(){"use strict";var e=document.querySelector("#nav-drawer-input");const t=window.innerWidth-document.documentElement.clientWidth;e&&t&&e.addEventListener("change",function(){this.checked?(document.documentElement.style.overflow="hidden",document.documentElement.style.paddingRight=t+"px"):document.documentElement.style=""});var e=document.querySelector("#side-nav");e&&!e.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked').length&&(e=e.querySelector('input[type="checkbox"], input[type="radio"]'))&&(e.checked=!0)}();
!function(){"use strict";var o=document.querySelector("article.doc"),n=document.querySelector(".toolbar"),i="scrollTo"in document.documentElement;function c(e){return e&&(~e.indexOf("%")?decodeURIComponent(e):e).slice(1)}function r(e){if(e){if(e.altKey||e.ctrlKey)return;window.location.hash="#"+this.id,e.preventDefault()}var t=function e(t,n){return o.contains(t)?e(t.offsetParent,t.offsetTop+n):n}(this,0)-n.getBoundingClientRect().bottom;!1===e&&i?window.scrollTo({left:0,top:t,behavior:"instant"}):window.scrollTo(0,t)}window.addEventListener("load",function e(t){var n;(n=c(window.location.hash))&&(n=document.getElementById(n))&&(r.call(n,!1),setTimeout(r.bind(n,!1),250)),window.removeEventListener("load",e)}),Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function(e){var t;(t=c(e.hash))&&(t=document.getElementById(t))&&e.addEventListener("click",r.bind(t))})}();
!function(){"use strict";var t=document.getElementById("theme-toggle"),e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",m=localStorage.getItem("theme")||e;t&&(t.onclick=function(){var t="light"===(document.documentElement.getAttribute("data-theme")||m||"light")?"dark":"light";document.documentElement.setAttribute("data-theme",t),localStorage.setItem("theme",t)})}();
!function(){"use strict";var a,t;window.analytics&&(a=document.querySelectorAll("a[data-track]"),t=document.querySelectorAll("[data-track]:not(a)"),a.forEach(a=>{window.analytics.trackLink(a,a.dataset.track)}),t.forEach(t=>{t.addEventListener("click",a=>{window.analytics.track(t.dataset.track)})}))}();
!function(){"use strict";const t=document.getElementById("feedback_dialog"),s=document.getElementById("feedback_form");if(t){const n=e=>{e.classList.remove("opacity-100"),e.classList.add("opacity-0"),setTimeout(()=>{e.classList.add("hidden")},150)},a=e=>{e.classList.remove("opacity-0"),e.classList.add("opacity-100"),setTimeout(()=>{e.classList.remove("hidden")},150)},c=()=>{const e=document.getElementById("feedback_buttons"),t=document.getElementById("feedback_thank_you");n(e),setTimeout(()=>{a(t)},150),setTimeout(()=>{n(t),setTimeout(()=>{a(e)},150)},5e3)};s.onsubmit=e=>{e.preventDefault();e=s.elements.message.value;e&&window.analytics&&window.analytics.track("Feedback Form",{message:e}),s.elements.message.value="",t.close(),c()},document.getElementById("feedback_button_yes").addEventListener("click",e=>{c()}),document.getElementById("feedback_form_cancel_button").addEventListener("click",e=>{s.elements.message.value=""}),document.getElementById("feedback_form_esc_button").addEventListener("click",e=>{s.elements.message.value=""}),t.addEventListener("cancel",e=>{s.elements.message.value="",c()})}}();
!function(){"use strict";document.getElementById("get-support").onclick=function(){try{window.Intercom("show")}catch(t){}}}();
!function(){"use strict";var d=/^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm,r=/( ) *\\\n *|\\\n( ?) */g,p=/ +$/gm,h=window.navigator.clipboard;[].slice.call(document.querySelectorAll(".doc pre.highlight, .doc .literalblock pre")).forEach(function(e){var t,n,a,i,s;if(e.classList.contains("highlight"))(c=(t=e.querySelector("code")).dataset.lang)&&"console"!==c&&((n=document.createElement("span")).className="source-lang",n.appendChild(document.createTextNode(c)));else{if(!e.innerText.startsWith("$ "))return;var c=e.parentNode.parentNode;c.classList.remove("literalblock"),c.classList.add("listingblock"),e.classList.add("highlightjs","highlight"),(t=document.createElement("code")).className="language-console hljs",t.dataset.lang="console",t.appendChild(e.firstChild),e.appendChild(t)}var l,c=e.parentNode.parentNode,e=e.parentNode,o=c.classList.contains("nolang");(i=document.createElement("div")).className="source-toolbox",c.firstElementChild.classList.contains("title")&&(s=c.firstElementChild),h&&((a=document.createElement("button")).className="copy-button",a.setAttribute("title","Copy to clipboard"),(l=document.createElement("span")).className="material-icons",l.innerText="content_paste",a.appendChild(l),(l=document.createElement("span")).className="copy-toast",l.appendChild(document.createTextNode("Copied!")),a.appendChild(l),i.appendChild(a)),a&&(a.addEventListener("click",function(e){var t=e.innerText.replace(p,"");"console"===e.dataset.lang&&t.startsWith("$ ")&&(t=function(e){var t,n=[];for(;t=d.exec(e);)n.push(t[1].replace(r,"$1$2"));return n.join(" && ")}(t));window.navigator.clipboard.writeText(t).then(function(){const e=this.querySelector(".material-icons");this.classList.add("clicked"),e.innerText="assignment_turned_in",this.offsetHeight,this.classList.remove("clicked"),setTimeout(function(){e.innerText="content_paste"},500)}.bind(this),function(){})}.bind(a,t)),e.prepend(i)),!n||s||o||((s=document.createElement("div")).className="title",s.appendChild(n),c.prepend(s)),n&&s&&!o&&s.appendChild(n)})}();
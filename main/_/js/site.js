!function(){"use strict";var e=document.querySelector("#nav-drawer-input");const t=window.innerWidth-document.documentElement.clientWidth;e&&t&&e.addEventListener("change",function(){this.checked?(document.documentElement.style.overflow="hidden",document.documentElement.style.paddingRight=t+"px"):document.documentElement.style=""});var n,e=document.querySelector("#side-nav");e&&(e.querySelectorAll(".collapse > .collapse-content.active").length||(n=e.querySelector(".collapse > .collapse-content"))&&n.classList.add("active"),n=e.querySelector(".nav-link.current-page"))&&(o=e.getBoundingClientRect(),i=(l=n.getBoundingClientRect()).top-o.top+e.scrollTop,l.top<o.top||l.bottom>o.bottom-160)&&(e.scrollTop=i-(e.clientHeight-160)/2+n.clientHeight/2);const c=document.querySelector(".global-nav");if(c){const s=document.createElement("button");s.className="scroll-btn-left";var l=document.createElement("i");l.className="material-icons",l.textContent="chevron_left",s.appendChild(l),c.appendChild(s);const r=document.createElement("button");r.className="scroll-btn-right";var o=document.createElement("i"),i=(o.className="material-icons",o.textContent="chevron_right",r.appendChild(o),c.appendChild(r),()=>{s.classList.toggle("active",0<c.scrollLeft),r.classList.toggle("active",c.scrollWidth>c.clientWidth+c.scrollLeft+1)});i(),new ResizeObserver(i).observe(c),c.addEventListener("scroll",i),s.addEventListener("click",()=>{c.scrollLeft-=200}),r.addEventListener("click",()=>{c.scrollLeft+=200})}}();
!function(){"use strict";var e=document.querySelector("aside.toc.sidebar");if(e){var t=parseInt(e.dataset.levels||2,10);if(!(t<0)){for(var i="article.doc",s=document.querySelector(i),n=[],o=0;o<=t;o++){var a=[i];if(o){for(var r=1;r<=o;r++)a.push((2===r?".sectionbody>":"")+".sect"+r);a.push("h"+(o+1)+"[id]")}else a.push("h1[id].sect0");n.push(a.join(">"))}p=n.join(","),u=s.parentNode;var d,c=[].slice.call((u||document).querySelectorAll(p));if(!c.length)return e.classList.add("!hidden");var l={},m=c.reduce(function(e,t){var i=document.createElement("a"),n=(i.textContent=t.textContent,l[i.href="#"+t.id]=i,document.createElement("li")),t=parseInt(t.nodeName.slice(1),10)-1;return n.dataset.level=t,n.className="!m-0",i.className=`block py-1 pr-1 !no-underline text-body-small
      hover:!text-link [&.is-active]:!text-link [&.is-active]:border-[var(--ds-primary-main)] border-l-2`,1==t&&i.classList.add("pl-2","text-button"),2==t&&i.classList.add("pl-4","!text-tertiary"),3==t&&i.classList.add("pl-6","!text-tertiary"),n.appendChild(i),e.appendChild(n),e},document.createElement("ul")),u=(m.className="!p-0 !m-0 !list-none",e.querySelector(".toc-menu")),p=(u||((u=document.createElement("div")).className="toc-menu"),document.createElement("h3")),e=(p.className="!my-2 text-h3 text-primary",p.textContent=e.dataset.title||"Contents",u.appendChild(p),u.appendChild(m),!document.getElementById("toc")&&s.querySelector("h1.page ~ :not(.is-before-toc)"));e&&((p=document.createElement("aside")).className="mb-6 toc embedded xl:hidden",p.appendChild(u.cloneNode(!0)),e.parentNode.insertBefore(p,e)),window.addEventListener("load",function(){f(),window.addEventListener("scroll",f)})}}function f(){var n,o,t,e=window.pageYOffset,i=1.15*h(document.documentElement,"fontSize"),a=s.offsetTop;e&&window.innerHeight+e+2>=document.documentElement.scrollHeight?(d=Array.isArray(d)?d:Array(d||0),n=[],o=c.length-1,c.forEach(function(e,t){var i="#"+e.id;t===o||e.getBoundingClientRect().top+h(e,"paddingTop")>a?(n.push(i),d.indexOf(i)<0&&l[i].classList.add("is-active")):~d.indexOf(i)&&l[d.shift()].classList.remove("is-active")}),m.scrollTop=m.scrollHeight-m.offsetHeight,d=1<n.length?n:n[0]):(Array.isArray(d)&&(d.forEach(function(e){l[e].classList.remove("is-active")}),d=void 0),c.some(function(e){if(e.getBoundingClientRect().top+h(e,"paddingTop")-i>a)return!0;t="#"+e.id}),t?t!==d&&(d&&l[d].classList.remove("is-active"),(e=l[t]).classList.add("is-active"),m.scrollHeight>m.offsetHeight&&(m.scrollTop=Math.max(0,e.offsetTop+e.offsetHeight-m.offsetHeight)),d=t):d&&(l[d].classList.remove("is-active"),d=void 0))}function h(e,t){return parseFloat(window.getComputedStyle(e)[t])}}();
!function(){"use strict";const m=document.querySelectorAll("#theme-toggle .toggle-button"),a=e=>{var t;"system"===e?(t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light",document.documentElement.setAttribute("data-theme",t),document.documentElement.setAttribute("data-theme-system",!0),localStorage.removeItem("themePreference")):(document.documentElement.setAttribute("data-theme",e),document.documentElement.removeAttribute("data-theme-system"),localStorage.setItem("themePreference",e)),o(e)},o=e=>{const t=document.querySelector(`#theme-toggle .toggle-button[value="${e}"]`);m.forEach(e=>{e.setAttribute("aria-pressed",e===t)})};o(localStorage.getItem("themePreference")||"system"),m.forEach(m=>{m.addEventListener("click",()=>{var e=document.documentElement.getAttribute("data-theme"),t=document.documentElement.hasAttribute("data-theme-system");m.value===e&&!t||"system"===m.value&&t||a(m.value)})}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",e=>{document.documentElement.hasAttribute("data-theme-system")&&a("system")})}();
!function(){"use strict";var a,t;window.analytics&&(a=document.querySelectorAll("a[data-track]"),t=document.querySelectorAll("[data-track]:not(a)"),a.forEach(a=>{window.analytics.trackLink(a,a.dataset.track)}),t.forEach(t=>{t.addEventListener("click",a=>{window.analytics.track(t.dataset.track)})}))}();
!function(){"use strict";const t=document.getElementById("feedback_dialog"),s=document.getElementById("feedback_form");if(t){const n=e=>{e.classList.remove("opacity-100"),e.classList.add("opacity-0"),setTimeout(()=>{e.classList.add("hidden")},150)},a=e=>{e.classList.remove("opacity-0"),e.classList.add("opacity-100"),setTimeout(()=>{e.classList.remove("hidden")},150)},c=()=>{const e=document.getElementById("feedback_buttons"),t=document.getElementById("feedback_thank_you");n(e),setTimeout(()=>{a(t)},150),setTimeout(()=>{n(t),setTimeout(()=>{a(e)},150)},5e3)};s.onsubmit=e=>{e.preventDefault();e=s.elements.message.value;e&&window.analytics&&window.analytics.track("Feedback Form",{message:e}),s.elements.message.value="",t.close(),c()},document.getElementById("feedback_button_yes").addEventListener("click",e=>{c()}),document.getElementById("feedback_form_cancel_button").addEventListener("click",e=>{s.elements.message.value=""}),document.getElementById("feedback_form_esc_button").addEventListener("click",e=>{s.elements.message.value=""}),t.addEventListener("cancel",e=>{s.elements.message.value="",c()})}}();
!function(){"use strict";document.getElementById("get-support").onclick=function(){try{window.Intercom("show")}catch(t){}}}();
!function(){"use strict";var d=/^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm,r=/( ) *\\\n *|\\\n( ?) */g,p=/ +$/gm,h=window.navigator.clipboard;[].slice.call(document.querySelectorAll(".doc pre.highlight, .doc .literalblock pre")).forEach(function(e){var t,n,a,i,s;if(e.classList.contains("highlight"))(c=(t=e.querySelector("code")).dataset.lang)&&"console"!==c&&((n=document.createElement("span")).className="source-lang",n.appendChild(document.createTextNode(c)));else{if(!e.innerText.startsWith("$ "))return;var c=e.parentNode.parentNode;c.classList.remove("literalblock"),c.classList.add("listingblock"),e.classList.add("highlightjs","highlight"),(t=document.createElement("code")).className="language-console hljs",t.dataset.lang="console",t.appendChild(e.firstChild),e.appendChild(t)}var l,c=e.parentNode.parentNode,e=e.parentNode,o=c.classList.contains("nolang");(i=document.createElement("div")).className="source-toolbox",c.firstElementChild.classList.contains("title")&&(s=c.firstElementChild),h&&((a=document.createElement("button")).className="copy-button",a.setAttribute("title","Copy to clipboard"),(l=document.createElement("span")).className="material-icons",l.innerText="content_paste",a.appendChild(l),(l=document.createElement("span")).className="copy-toast",l.appendChild(document.createTextNode("Copied!")),a.appendChild(l),i.appendChild(a)),a&&(a.addEventListener("click",function(e){var t=e.innerText.replace(p,"");"console"===e.dataset.lang&&t.startsWith("$ ")&&(t=function(e){var t,n=[];for(;t=d.exec(e);)n.push(t[1].replace(r,"$1$2"));return n.join(" && ")}(t));window.navigator.clipboard.writeText(t).then(function(){const e=this.querySelector(".material-icons");this.classList.add("clicked"),e.innerText="assignment_turned_in",this.offsetHeight,this.classList.remove("clicked"),setTimeout(function(){e.innerText="content_paste"},500)}.bind(this),function(){})}.bind(a,t)),e.prepend(i)),!n||s||o||((s=document.createElement("div")).className="title",s.appendChild(n),c.prepend(s)),n&&s&&!o&&s.appendChild(n)})}();
!function(){"use strict";document.querySelectorAll(".tabs").forEach(e=>{e=e.querySelector(".tablist");const t=e.querySelector(".tablist > ul"),l=document.createElement("button");l.className="scroll-btn-left";var c=document.createElement("i");c.className="material-icons",c.textContent="chevron_left",l.appendChild(c),e.appendChild(l);const n=document.createElement("button");n.className="scroll-btn-right";c=document.createElement("i"),c.className="material-icons",c.textContent="chevron_right",n.appendChild(c),e.appendChild(n),c=()=>{l.classList.toggle("active",0<t.scrollLeft),n.classList.toggle("active",t.scrollWidth>t.clientWidth+t.scrollLeft+1)};c(),new ResizeObserver(c).observe(t),t.addEventListener("scroll",c),l.addEventListener("click",()=>{t.scrollLeft-=200}),n.addEventListener("click",()=>{t.scrollLeft+=200})})}();
!function(){"use strict";document.querySelectorAll(".collapse").forEach(e=>{var t,a,r=e.querySelector(".collapse-trigger"),e=e.querySelector(".collapse-content");a=e,(t=r).ariaExpanded=!1,t.addEventListener("click",e=>{e.stopPropagation(),e.preventDefault(),a.classList.toggle("active"),t.classList.toggle("active"),t.ariaExpanded="true"!==t.ariaExpanded})})}();
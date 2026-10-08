(function(){
function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
var K="hub-theme";
function applyTheme(t){var r=document.documentElement;if(t){r.setAttribute("data-theme",t)}else{r.removeAttribute("data-theme")}}
try{applyTheme(localStorage.getItem(K))}catch(e){}
function curDark(){var t=document.documentElement.getAttribute("data-theme");if(t)return t==="dark";return window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches}
document.addEventListener("DOMContentLoaded",function(){
 var tb=$("#themebtn");if(tb){tb.addEventListener("click",function(){var n=curDark()?"light":"dark";applyTheme(n);try{localStorage.setItem(K,n)}catch(e){}})}
 var mb=$("#menubtn"),nv=$("#nav");if(mb&&nv){mb.addEventListener("click",function(){var o=nv.classList.toggle("open");mb.setAttribute("aria-expanded",o)})}
 // countdowns
 $$("[data-date]").forEach(function(el){var d=new Date(el.getAttribute("data-date")+"T12:00:00");var n=Math.round((d-new Date())/864e5);var t=n>1?"in "+n+" days":n===1?"tomorrow":n===0?"today":Math.abs(n)+(Math.abs(n)===1?" day ago":" days ago");el.textContent=t});
 // sortable tables
 $$("table.sortable").forEach(function(t){var ths=$$("th",t);ths.forEach(function(th,i){if(th.hasAttribute("data-nosort"))return;var b=document.createElement("button");b.type="button";b.textContent=th.textContent;th.textContent="";th.appendChild(b);b.addEventListener("click",function(){var dir=th.getAttribute("data-dir")==="asc"?"desc":"asc";ths.forEach(function(x){x.removeAttribute("data-dir")});th.setAttribute("data-dir",dir);var tb=t.tBodies[0];var rows=$$("tr",tb);rows.sort(function(a,b){var x=a.cells[i].getAttribute("data-v")||a.cells[i].textContent,y=b.cells[i].getAttribute("data-v")||b.cells[i].textContent;var nx=parseFloat(String(x).replace(/[^0-9.\-]/g,"")),ny=parseFloat(String(y).replace(/[^0-9.\-]/g,""));var c=(!isNaN(nx)&&!isNaN(ny)&&/^[\s$0-9.,\-]/.test(String(x)))?nx-ny:String(x).localeCompare(String(y));return dir==="asc"?c:-c});rows.forEach(function(r){tb.appendChild(r)})})})});
 // lane filters
 $$("[data-filter-group]").forEach(function(g){var tgt=document.querySelector(g.getAttribute("data-filter-group"));if(!tgt)return;var chips=$$("button.chip",g);chips.forEach(function(c){c.addEventListener("click",function(){chips.forEach(function(x){x.setAttribute("aria-pressed","false")});c.setAttribute("aria-pressed","true");var v=c.getAttribute("data-v");$$("[data-lane]",tgt).forEach(function(r){var ok=v==="all"||(r.getAttribute("data-lane")||"").split(" ").indexOf(v)>-1;r.style.display=ok?"":"none"})})})});
 // glossary search
 var gs=$("#gsearch");if(gs){gs.addEventListener("input",function(){var q=gs.value.toLowerCase();$$("#gloss tr").forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(q)>-1?"":"none"})})}
 // exposure calc
 var ex=$("#expo");if(ex){var f=function(){var v=function(i){return parseFloat($("#"+i).value)||0};var r=Math.max(0,v("e1")-v("e2")-v("e3")-v("e4"));$("#eout").textContent="$"+r.toLocaleString(undefined,{maximumFractionDigits:1})+" million"};$$("input",ex).forEach(function(i){i.addEventListener("input",f)});f()}
 var ld=$("#loadc");if(ld){var g=function(){var mw=parseFloat($("#l1").value)||0,lf=(parseFloat($("#l2").value)||0)/100,hh=parseFloat($("#l3").value)||1;var mwh=mw*lf*8760;$("#lo1").textContent=Math.round(mwh).toLocaleString();$("#lo2").textContent=Math.round(mwh*1000/hh).toLocaleString();$("#lo3").textContent=(mw*24).toLocaleString()+" MWh a day at full output"};$$("input",ld).forEach(function(i){i.addEventListener("input",g)});g()}
});
})();

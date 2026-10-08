(function(){
var S=DC.states,G=GEO,P=DC.proj;
function $(s,r){return (r||document).querySelector(s)}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function fmt(n){return n==null?"n/a":Math.round(n).toLocaleString()}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var byA={};S.forEach(function(s){byA[s.a]=s});
var M={sites:{l:"Data centers (count)",f:function(s){return s.c},u:" sites"},pl:{l:"Planned capacity (MW)",f:function(s){return s.cv?s.cv.plmw:null},u:" MW"},op:{l:"Operating capacity (MW)",f:function(s){return s.cv?s.cv.opmw:null},u:" MW"},tot:{l:"Operating plus planned (MW)",f:function(s){return s.cv?s.cv.tot:null},u:" MW"}};
var metric="sites",sel="IL";
var us=$("#usmap");
if(us){
 var svg='<svg class="map" viewBox="0 0 975 610" role="group" aria-label="Map of the United States by state">';
 S.forEach(function(s){svg+='<path class="st" data-a="'+s.a+'" d="'+s.d+'" tabindex="0" role="button" aria-label="'+esc(s.n)+'"></path>'});
 svg+='<path d="'+G.border+'" fill="none" stroke="var(--card)" stroke-width=".6" pointer-events="none"></path>';
 S.forEach(function(s){if(s.area>2600&&s.a!=="DC")svg+='<text x="'+s.x+'" y="'+(s.y+3)+'">'+s.a+'</text>'});
 svg+='</svg>';
 us.innerHTML=svg;
 var tip=$("#maptip");
 function maxv(){var m=0;S.forEach(function(s){var v=M[metric].f(s);if(v!=null&&v>m)m=v});return m}
 function paint(){var m=maxv();$$("path.st",us).forEach(function(p){var s=byA[p.getAttribute("data-a")],v=M[metric].f(s);if(v==null){p.setAttribute("class","st nodata"+(s.a===sel?" sel":""));p.style.fillOpacity=""}else{p.setAttribute("class","st"+(s.a===sel?" sel":""));p.style.fillOpacity=(0.17+0.83*Math.sqrt(v/m)).toFixed(3)}});
  $("#legmax").textContent=fmt(m)+M[metric].u;$("#maptitle").textContent=M[metric].l;}
 function rank(fn,s){var arr=S.filter(function(x){return fn(x)!=null}).sort(function(a,b){return fn(b)-fn(a)});var i=arr.indexOf(s);return i<0?null:(i+1)+" of "+arr.length}
 function bar(label,v,max,cls){return '<div class="bar"><span>'+label+'</span><div class="tr"><div class="fl '+(cls||"")+'" style="width:'+(max?Math.max(1,100*v/max):0)+'%"></div></div><span class="v">'+fmt(v)+'</span></div>'}
 function panel(a){var s=byA[a],il=byA.IL;var h='<h3>'+esc(s.n)+'</h3><p class="small mut">'+esc(s.g)+'</p>';
  h+='<div class="kv"><div><b>'+fmt(s.c)+'</b><span>data centers (Data Center Map)</span></div>';
  h+=s.cv?'<div><b>'+fmt(s.cv.opmw)+'</b><span>operating MW ('+fmt(s.cv.opn)+' sites)</span></div><div><b>'+fmt(s.cv.plmw)+'</b><span>planned MW ('+fmt(s.cv.pln)+' projects)</span></div><div><b>'+fmt(s.cv.tot)+'</b><span>operating plus planned MW</span></div>':'<div style="grid-column:span 1"><b>n/a</b><span>megawatts not available for this state</span></div>';
  h+='</div>';
  var maxc=Math.max.apply(null,S.map(function(x){return x.c}));
  h+='<div class="bars" style="margin:10px 0">'+bar(esc(s.a)+" sites",s.c,maxc)+(a!=="IL"?bar("IL sites",il.c,maxc,"t"):"")+'</div>';
  h+='<p class="small"><b>Rank by count</b> '+rank(function(x){return x.c},s)+'. <b>Rank by planned MW</b> '+(s.cv?rank(function(x){return x.cv?x.cv.plmw:null},s):"n/a")+'.</p>';
  if(s.rel)h+='<p><span class="tag">Why it matters here</span> '+esc(s.rel)+'</p>';
  if(s.pol)h+='<p><b>Policy notes.</b> '+esc(s.pol)+'</p>';else h+='<p class="small mut">No state policy notes collected for this page yet.</p>';
  if(s.why)h+='<p><b>Read.</b> '+esc(s.why)+'</p>';
  if(a==="IL")h+='<p><a class="chip on" style="text-decoration:none;display:inline-block" href="#illinois-close">Open the Illinois close up</a></p>';
  h+='<p class="src">Counts from Data Center Map. Megawatts from Cleanview. Both retrieved October 8, 2026 and defined differently, so they do not reconcile.</p>';
  $("#panel").innerHTML=h;}
 function select(a,scroll){sel=a;paint();panel(a);if(scroll&&window.innerWidth<=860){$("#panel").scrollIntoView({behavior:"smooth",block:"start"})}$$("#statetable tbody tr").forEach(function(r){r.style.background=r.getAttribute("data-a")===a?"var(--tint)":""})}
 us.addEventListener("click",function(e){var p=e.target.closest&&e.target.closest("path.st");if(p)select(p.getAttribute("data-a"),true)});
 us.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){var p=e.target;if(p.getAttribute&&p.getAttribute("data-a")){e.preventDefault();select(p.getAttribute("data-a"))}}});
 us.addEventListener("mousemove",function(e){var p=e.target.closest&&e.target.closest("path.st");if(!p){tip.style.display="none";return}var s=byA[p.getAttribute("data-a")],v=M[metric].f(s);var r=us.getBoundingClientRect();tip.style.display="block";tip.textContent=s.n+"  "+(v==null?"no data":fmt(v)+M[metric].u);tip.style.left=Math.min(r.width-150,e.clientX-r.left+12)+"px";tip.style.top=(e.clientY-r.top+12)+"px"});
 us.addEventListener("mouseleave",function(){tip.style.display="none"});
 $$("#metricbtns button").forEach(function(b){b.addEventListener("click",function(){$$("#metricbtns button").forEach(function(x){x.setAttribute("aria-pressed","false")});b.setAttribute("aria-pressed","true");metric=b.getAttribute("data-m");paint()})});
 // table
 var tb=$("#statetable tbody");var rows="";S.slice().sort(function(a,b){return b.c-a.c}).forEach(function(s){rows+='<tr data-a="'+s.a+'" style="cursor:pointer"><td>'+esc(s.n)+'</td><td class="n" data-v="'+s.c+'">'+fmt(s.c)+'</td><td class="n" data-v="'+(s.cv?s.cv.opmw:-1)+'">'+fmt(s.cv?s.cv.opmw:null)+'</td><td class="n" data-v="'+(s.cv?s.cv.plmw:-1)+'">'+fmt(s.cv?s.cv.plmw:null)+'</td><td>'+esc(s.g)+'</td></tr>'});tb.innerHTML=rows;
 tb.addEventListener("click",function(e){var r=e.target.closest("tr");if(r){select(r.getAttribute("data-a"));us.scrollIntoView({behavior:"smooth",block:"center"})}});
 var q=$("#statesearch");if(q)q.addEventListener("input",function(){var v=q.value.toLowerCase();$$("#statetable tbody tr").forEach(function(r){r.style.display=r.textContent.toLowerCase().indexOf(v)>-1?"":"none"})});
 select("IL");
}
// Illinois close up
var il=$("#ilmap");
if(il){
 var ps=P.slice().sort(function(a,b){return (b.mw||0)-(a.mw||0)});var flt="all",cur=null;
 function r(p){return p.mw==null?6:4+Math.sqrt(p.mw)*0.42}
 function draw(){var h='<svg class="il" viewBox="0 0 '+G.W+' '+G.H+'" role="group" aria-label="Map of Illinois counties with data center projects">';
  G.counties.forEach(function(c){h+='<path class="co" d="'+c.d+'"></path>'});h+='<path class="out" d="'+G.outline+'"></path>';
  ps.forEach(function(p){var vis=flt==="all"||(flt==="op"&&p.st==="op")||(flt==="pl"&&p.st==="pl")||(flt==="mi"&&p.rto.indexOf("MISO")===0)||(flt==="pj"&&p.rto.indexOf("PJM")===0);if(!vis)return;h+='<circle class="dot '+p.st+(cur===p.id?" sel":"")+'" data-id="'+p.id+'" cx="'+p.x+'" cy="'+p.y+'" r="'+r(p).toFixed(1)+'" tabindex="0" role="button" aria-label="'+esc(p.n)+'"></circle>'});
  h+='</svg>';il.innerHTML=h}
 function detail(id){var p=P[id];cur=id;draw();var h='<h3>'+esc(p.n)+'</h3><div class="kv"><div><b>'+(p.mw==null?"n/a":fmt(p.mw)+" MW")+'</b><span>reported capacity</span></div><div><b>'+(p.st==="op"?"Operating":"Planned")+'</b><span>status per source</span></div></div><p><b>Developer or operator.</b> '+esc(p.dev)+'<br><b>Place.</b> '+esc((p.city?p.city+", ":"")+p.co+" County")+'<br><b>Grid.</b> '+esc(p.rto)+(p.inv?'<br><b>Investment.</b> '+esc(p.inv):"")+'</p><p class="src">'+esc(p.src)+'</p>';$("#ilpanel").innerHTML=h}
 il.addEventListener("click",function(e){var c=e.target.closest&&e.target.closest("circle.dot");if(c)detail(+c.getAttribute("data-id"))});
 il.addEventListener("keydown",function(e){if((e.key==="Enter"||e.key===" ")&&e.target.getAttribute&&e.target.getAttribute("data-id")){e.preventDefault();detail(+e.target.getAttribute("data-id"))}});
 $$("#ilfilter button").forEach(function(b){b.addEventListener("click",function(){$$("#ilfilter button").forEach(function(x){x.setAttribute("aria-pressed","false")});b.setAttribute("aria-pressed","true");flt=b.getAttribute("data-v");cur=null;draw()})});
 var tb2=$("#iltable tbody");if(tb2){var rr="";P.slice().sort(function(a,b){return (b.mw||0)-(a.mw||0)}).forEach(function(p){rr+='<tr data-id="'+p.id+'" style="cursor:pointer"><td>'+esc(p.n)+'</td><td>'+esc(p.dev)+'</td><td>'+esc(p.city||p.co+" County")+'</td><td class="n" data-v="'+(p.mw==null?-1:p.mw)+'">'+fmt(p.mw)+'</td><td>'+(p.st==="op"?"Operating":"Planned")+'</td><td>'+esc(p.rto.split(",")[0])+'</td></tr>'});tb2.innerHTML=rr;tb2.addEventListener("click",function(e){var t=e.target.closest("tr");if(t){detail(+t.getAttribute("data-id"));il.scrollIntoView({behavior:"smooth",block:"center"})}})}
 draw();detail(P.length-1);
}
})();

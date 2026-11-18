/* ---- Menubalk: vast bovenaan + mobiel menu ---- */
(function(){
  var top=document.querySelector('.top'), btn=top&&top.querySelector('.menu-btn');
  if(!top) return;
  function stuck(){ top.classList.toggle('scrolled', window.scrollY>8); }
  window.addEventListener('scroll',stuck,{passive:true}); stuck();
  if(!btn) return;
  function set(open){ top.classList.toggle('open',open); btn.setAttribute('aria-expanded',open?'true':'false'); }
  btn.addEventListener('click',function(){ set(!top.classList.contains('open')); });
  top.querySelectorAll('nav a').forEach(function(a){ a.addEventListener('click',function(){ set(false); }); });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && top.classList.contains('open')){ set(false); btn.focus(); } });
  document.addEventListener('click',function(e){ if(!top.contains(e.target)) set(false); });
})();

/* ---- Keuzehulp ---- */
(function(){
  var WAX = {
    indoor:{rec:"RB White", sport:"RB White", pro:"RB White"},
    mid:{rec:"Universal Violet", sport:"RB Violet", pro:"RB Violet"},
    late:{rec:"Universal Red", sport:"RB Red", pro:"RB Red"},
    glacier:{rec:"Universal Violet", sport:"Universal Violet", pro:"RB Violet"}
  };
  var WAXWHY = {
    "RB White":"De hardste wax, tegen schurende kunstsneeuw (−12 tot −30 °C).",
    "Universal Violet":"Snel op koude, droge sneeuw (−10 tot −20 °C) en beschermt je belag.",
    "RB Violet":"Harder en slijtvaster op koude, harde pistes (−7 tot −12 °C).",
    "Universal Red":"Natte, zware voorjaarssneeuw plakt niet (0 tot −10 °C).",
    "RB Red":"De beste balans tussen hardheid en slijtvastheid (−3 tot −7 °C)."
  };
  var EDGE = {
    ski:{
      rec:{val:"Zijkant 89°, onderkant 1,0°", why:"Genoeg grip op normale sneeuw en vergevingsgezind."},
      sport:{val:"Zijkant 88°, onderkant 1,0°", why:"Veel grip op ijzige pistes, vraagt wat meer techniek."},
      pro:{val:"Zijkant 87°, onderkant 0,5°", why:"Maximale grip op ijs. 0,5° kan alleen als je onderkant nog nooit op 1,0° is geslepen."}
    },
    board:{
      rec:{val:"Zijkant 90°, onderkant 1,0°", why:"Draait rustig en voorspelbaar, je hapt niet snel."},
      sport:{val:"Zijkant 89°, onderkant 1,0°", why:"Meer grip op harde sneeuw, nog steeds vergevingsgezind."},
      pro:{val:"Zijkant 88°, onderkant 1,0°", why:"Veel beet voor strakke carves. Kan sneller happen als je techniek niet goed genoeg is."}
    }
  };
  var PACK = {
    rec:{val:"Waxen + slijpen", price:"€35", why:"Geen krassen of kale plekken in je belag? Dan is dit genoeg. Wel schade? Kies de complete beurt (€45)."},
    sport:{val:"Waxen + slijpen", price:"€35", why:"Met schade in het belag wordt het de complete beurt met vullen (€45)."},
    pro:{val:"Complete beurt", price:"€45", why:"Waxen, slijpen en vullen. Een gaaf belag houdt je kant en wax het langst strak."}
  };
  var out = document.getElementById('result');
  var ask = document.getElementById('askBtn');
  function val(n){var e=document.querySelector('input[name="'+n+'"]:checked');return e?e.value:null}
  function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function render(){
    var g=val('gear'), w=val('when'), l=val('level');
    if(!g||!w||!l){return}
    var wax=WAX[w][l], e=EDGE[g][l], p=PACK[l];
    var edgeNote = "";
    out.innerHTML =
      '<div class="r"><h4>Wax</h4><div class="val">'+esc(wax)+'</div><p>'+esc(WAXWHY[wax])+'</p></div>'+
      '<div class="r"><h4>Slijpgraad</h4><div class="val">'+esc(e.val)+'</div><p>'+esc(e.why+edgeNote)+'</p></div>'+
      '<div class="r"><h4>Behandeling</h4><div class="val">'+esc(p.val)+' · '+p.price+'</div><p>'+esc(p.why)+'</p></div>';
    var msg = "Hoi Jeroen! Ik wil graag mijn "+(g==='ski'?"ski’s":"snowboard")+" laten doen. Keuzehulp zegt: "+wax+", "+e.val+", "+p.val+". Klopt dat voor mij?";
    ask.href = "https://wa.me/31616755014?text="+encodeURIComponent(msg);
    ask.textContent = "Stuur dit advies naar Jeroen";
  }
  document.querySelectorAll('.helper input').forEach(function(i){i.addEventListener('change',render)});
})();

/* ---- Scroll-sliert ---- */
(function(){
  var svg=document.getElementById('trail'), track=svg.querySelector('.track'), carve=svg.querySelector('.carve');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var total=0, samples=[], W=0, H=0;
  function build(){
    var w=document.documentElement.clientWidth, h=document.documentElement.scrollHeight;
    if(w===W && Math.abs(h-H)<4) return; W=w; H=h;
    svg.setAttribute('height',h); svg.setAttribute('viewBox','0 0 '+w+' '+h);
    var step = w<700 ? 620 : 820, L=w*0.06, R=w*0.94;
    var pts=[[w*0.12,-30],[R,step*0.62]], y=step*0.62, right=true;
    while(y<h){ y+=step; right=!right; pts.push([right?R:L, Math.min(y,h+40)]); }
    var d='M'+pts[0][0]+','+pts[0][1];
    for(var i=1;i<pts.length;i++){
      var a=pts[i-1], b=pts[i], k=(b[1]-a[1])*0.55;
      d+=' C'+a[0]+','+(a[1]+k)+' '+b[0]+','+(b[1]-k)+' '+b[0]+','+b[1];
    }
    track.setAttribute('d',d); carve.setAttribute('d',d);
    total=carve.getTotalLength(); samples=[];
    for(var l=0;l<=total;l+=20){ samples.push([l, carve.getPointAtLength(l).y]); }
    carve.style.strokeDasharray=total+' '+total;
    update();
  }
  function lengthAtY(t){
    var best=0; for(var i=0;i<samples.length;i++){ if(samples[i][1]<=t) best=samples[i][0]; else break; }
    return best;
  }
  function update(){
    if(!total) return;
    var drawn = reduce ? total : lengthAtY(window.scrollY + window.innerHeight*0.62);
    carve.style.strokeDashoffset = total - drawn;
  }
  var ticking=false;
  window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(function(){ ticking=false; update(); }); } },{passive:true});
  window.addEventListener('resize',build);
  if('ResizeObserver' in window){ new ResizeObserver(build).observe(document.body); }
  window.addEventListener('load',build);
  build();
})();

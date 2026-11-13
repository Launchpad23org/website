// Mobile menu + "Families & More" dropdown
(function(){
  var toggle=document.querySelector('.nav-toggle');
  if(toggle){toggle.addEventListener('click',function(){
    var open=document.body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded',open?'true':'false');
  });}
  var more=document.querySelector('.more'), btn=document.querySelector('.more-btn');
  if(more&&btn){
    btn.addEventListener('click',function(e){e.stopPropagation();var o=more.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');});
    document.addEventListener('click',function(){more.classList.remove('open');btn.setAttribute('aria-expanded','false');});
  }
})();

// Home video: autoplay silently, unless the visitor has asked their device to reduce motion
(function(){
  var v=document.querySelector('video.promo'); if(!v) return;
  var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce){ v.autoplay=true; var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
})();

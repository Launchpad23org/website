/* Cadet Compass: four directions, saved in this browser; prints to one landscape page. */
(function(){
  var KEY='lp23-cadet-compass', st={};
  try{ st=JSON.parse(localStorage.getItem(KEY))||{}; }catch(e){}
  var fields=document.querySelectorAll('[data-k]');
  [].forEach.call(fields,function(el){
    var k=el.getAttribute('data-k'); if(st[k]) el.value=st[k];
    el.addEventListener('input',function(){ st[k]=el.value; try{ localStorage.setItem(KEY,JSON.stringify(st)); }catch(e){} });
  });
  // Textareas cut off long text when printed, so print a copy of each answer as plain text
  function mirror(){ [].forEach.call(document.querySelectorAll('textarea[data-k]'),function(t){ var d=t.nextElementSibling; if(!d||!d.classList.contains('print-text')){ d=document.createElement('div'); d.className='print-text'; t.after(d); } d.textContent=t.value; }); }
  window.addEventListener('beforeprint',function(){ mirror(); document.body.classList.add('print-landscape'); });
  document.getElementById('cc-print').addEventListener('click',function(){ mirror(); document.body.classList.add('print-landscape'); window.print(); });
  window.addEventListener('afterprint',function(){ document.body.classList.remove('print-landscape'); });
  var r=document.getElementById('cc-reset');
  r.addEventListener('click',function(){
    if(r.getAttribute('data-sure')!=='1'){ r.setAttribute('data-sure','1'); r.textContent='Click again to erase your compass'; return; }
    st={}; try{ localStorage.removeItem(KEY); }catch(e){}
    [].forEach.call(fields,function(el){ el.value=''; }); r.removeAttribute('data-sure'); r.textContent='Start over';
  });
})();

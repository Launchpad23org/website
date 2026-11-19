/* CALL to Action sunrise: 12 skills x 5 rings. Click a ring to set that skill's rating.
   Ratings save in this browser; Download PDF prints one landscape page. */
(function(){
  var GROUPS=[
    {k:'C',name:'Communicate',tag:'your interests, needs, and vision persuasively',color:'#f2a33a',skills:[
      ['Oral communication','Speak clearly and persuasively to others.'],
      ['Written communication','Convince and communicate clearly in writing.'],
      ['Mass communication','Move people you do not know with your goals.']]},
    {k:'A',name:'Act',tag:'to accomplish your goals',color:'#e2603f',skills:[
      ['Decision making','Make the right choices for your goals and circumstances.'],
      ['Problem solving','Solve the challenges that will inevitably arise.'],
      ['Efficacy','Complete the actions needed to accomplish your goals.']]},
    {k:'L',name:'Learn',tag:'to optimize your choices',color:'#2f7fd1',skills:[
      ['Critical thinking','Make the best use of your given intellect and information.'],
      ['Interest-based expertise','Master the knowledge necessary in your chosen professional field.'],
      ['LIFE skills','Build the Literacy (technical), Interpersonal, Financial, and Executive functioning skills necessary to thrive.']]},
    {k:'LD',name:'Lead',tag:'any team to accomplish any goal',color:'#1c4587',skills:[
      ['Personal leadership','Lead by example, so that others willingly support you.'],
      ['Team leadership','Integrate individual strengths into a successful whole.'],
      ['Mission leadership','Mobilize networks to achieve unprecedented results.']]}
  ];
  var SK=[]; GROUPS.forEach(function(g){ g.skills.forEach(function(s){ SK.push({g:g,name:s[0],desc:s[1]}); }); });
  var KEY='lp23-call-to-action', st={r:{},name:''};
  try{ st=JSON.parse(localStorage.getItem(KEY))||st; st.r=st.r||{}; }catch(e){}
  function save(){ try{ localStorage.setItem(KEY,JSON.stringify(st)); }catch(e){} }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  var CX=500, CY=510, HUB=110, BAND1=116, BAND2=152, LAB1=156, LAB2=318, R0=322, STEP=34, N=5;
  var SHORT=[['Oral','Communication'],['Written','Communication'],['Mass','Communication'],['Decision','Making'],['Problem','Solving'],['Efficacy'],['Critical','Thinking'],['Interest-based','Expertise'],['LIFE Skills'],['Personal','Leadership'],['Team','Leadership'],['Mission','Leadership']];
  function pt(r,a){ var t=a*Math.PI/180; return [CX+r*Math.cos(t), CY-r*Math.sin(t)]; }
  function sector(r1,r2,a1,a2){ // a1 > a2 (degrees, counterclockwise from +x)
    var p1=pt(r2,a1),p2=pt(r2,a2),p3=pt(r1,a2),p4=pt(r1,a1);
    return 'M'+p1+' A'+r2+' '+r2+' 0 0 1 '+p2+' L'+p3+' A'+r1+' '+r1+' 0 0 0 '+p4+'Z';
  }
  var svg=document.getElementById('ca-svg'), list=document.getElementById('ca-list');
  function draw(){
    var h='', W=180/SK.length;
    SK.forEach(function(s,i){
      var a1=180-i*W, a2=a1-W, val=st.r[i]||0, gi=GROUPS.indexOf(s.g);
      // label band
      h+='<path d="'+sector(LAB1,LAB2,a1,a2)+'" fill="#e9ecf1" stroke="#fff" stroke-width="2"/>';
      var mid=(a1+a2)/2, flip=mid>90, rot=flip?180-mid:-mid;
      var tp=pt(flip?LAB2-10:LAB1+10,mid), lines=SHORT[i];
      h+='<text x="'+tp[0]+'" y="'+tp[1]+'" transform="rotate('+rot+' '+tp[0]+' '+tp[1]+')" text-anchor="start" class="ca-lab">'+lines.map(function(t,k){ return '<tspan x="'+tp[0]+'" dy="'+(k===0?(lines.length>1?'-0.2em':'0.35em'):'1.1em')+'">'+esc(t)+'</tspan>'; }).join('')+'</text>';
      for(var r=1;r<=N;r++){
        var on=r<=val;
        h+='<path class="ca-cell" data-i="'+i+'" data-r="'+r+'" d="'+sector(R0+(r-1)*STEP,R0+r*STEP,a1,a2)+'" fill="'+(on?s.g.color:'#fff')+'" fill-opacity="1" stroke="#c9cfd8" stroke-width="1.2"><title>'+esc(s.name)+': '+r+' of 5</title></path>';
      }
    });
    // group arcs + group labels (text follows the arc)
    GROUPS.forEach(function(g,gi){
      var a1=180-gi*45, a2=a1-45, rm=(BAND1+BAND2)/2, s1=pt(rm,a1), s2=pt(rm,a2);
      h+='<path d="'+sector(BAND1,BAND2,a1-0.6,a2+0.6)+'" fill="'+g.color+'"/>';
      h+='<path id="ca-arc'+gi+'" d="M'+s1+' A'+rm+' '+rm+' 0 0 1 '+s2+'" fill="none"/>';
      h+='<text class="ca-grp" dy="4"><textPath href="#ca-arc'+gi+'" startOffset="50%" text-anchor="middle">'+g.name.toUpperCase()+'</textPath></text>';
    });
    var p=pt(HUB,180), q=pt(HUB,0);
    h+='<path d="M'+p+' A'+HUB+' '+HUB+' 0 0 1 '+q+'Z" fill="#1c4587"/>';
    h+='<text x="'+CX+'" y="'+(CY-58)+'" text-anchor="middle" class="ca-hub1">CALL</text><text x="'+CX+'" y="'+(CY-28)+'" text-anchor="middle" class="ca-hub2">to Action</text>';
    svg.innerHTML=h;
    list.innerHTML=GROUPS.map(function(g){
      return '<div class="ca-group" style="--g:'+g.color+'"><h2><span>'+esc(g.name)+'</span> '+esc(g.tag)+'</h2>'+g.skills.map(function(s){
        var i=SK.findIndex(function(x){return x.name===s[0];}), val=st.r[i]||0;
        return '<div class="ca-skill"><div><b>'+esc(s[0])+'.</b> '+esc(s[1])+'</div><div class="ca-dots" role="radiogroup" aria-label="'+esc(s[0])+' rating">'+[1,2,3,4,5].map(function(r){return '<button type="button" class="ca-dot'+(r<=val?' on':'')+'" data-i="'+i+'" data-r="'+r+'" role="radio" aria-checked="'+(r===val)+'" aria-label="'+r+' of 5">'+r+'</button>';}).join('')+'</div></div>';
      }).join('')+'</div>';
    }).join('');
  }
  function set(i,r){ st.r[i] = (st.r[i]===r) ? r-1 : r; save(); draw(); }
  svg.addEventListener('click',function(e){ var c=e.target.closest('.ca-cell'); if(c) set(+c.getAttribute('data-i'),+c.getAttribute('data-r')); });
  list.addEventListener('click',function(e){ var c=e.target.closest('.ca-dot'); if(c) set(+c.getAttribute('data-i'),+c.getAttribute('data-r')); });
  var nm=document.getElementById('ca-name'); nm.value=st.name||''; nm.addEventListener('input',function(){ st.name=nm.value; save(); });
  document.getElementById('ca-print').addEventListener('click',function(){ document.body.classList.add('print-landscape'); window.print(); });
  window.addEventListener('beforeprint',function(){ document.body.classList.add('print-landscape'); });
  window.addEventListener('afterprint',function(){ document.body.classList.remove('print-landscape'); });
  var rs=document.getElementById('ca-reset');
  rs.addEventListener('click',function(){
    if(rs.getAttribute('data-sure')!=='1'){ rs.setAttribute('data-sure','1'); rs.textContent='Click again to erase your ratings'; return; }
    st={r:{},name:''}; save(); nm.value=''; rs.removeAttribute('data-sure'); rs.textContent='Start over'; draw();
  });
  draw();
})();

/* Examples page: reads the "Launchpad23 Website — Examples & Topics" Google Sheet.
   To change what appears here, edit the sheet. No code changes needed.
   If the sheet can't be reached, the page falls back to the copy saved in /data. */
(function(){
  var SHEET_ID = '1UjEp8kkm1yx4QmyanMly9JxXLwUBOjD0axoSiqrAiAg';
  var TABS = { resources: 'Free Resources', topics: 'Weekly Topics' };
  /* This year's topics come from the Wednesday Topics tab of the "Launchpad23 Weekly Pages" sheet,
     the same rows that fill the This Week at Launchpad23 page. Every dated row up to today is archived here. */
  var WEEKLY_PAGES_ID = '1k-s0e-_88iBPJo0j93sIPkA0DlT-gK7n6X1gj1JmMzA';
  var WED_TAB = 'Wednesday Topics';
  var WED_IMAGES = 'ghana/images/';

  function sheetUrl(tab, id){
    return 'https://docs.google.com/spreadsheets/d/' + (id||SHEET_ID) + '/gviz/tq?tqx=out:csv&headers=1&sheet=' + encodeURIComponent(tab);
  }

  // Minimal CSV parser (handles quotes, commas and newlines inside quotes)
  function parseCSV(text){
    var rows=[], row=[], f='', q=false;
    for (var i=0;i<text.length;i++){
      var c=text[i];
      if (q){ if (c==='"'){ if (text[i+1]==='"'){ f+='"'; i++; } else q=false; } else f+=c; }
      else if (c==='"') q=true;
      else if (c===','){ row.push(f); f=''; }
      else if (c==='\n'){ row.push(f); rows.push(row); row=[]; f=''; }
      else if (c!=='\r') f+=c;
    }
    if (f!=='' || row.length){ row.push(f); rows.push(row); }
    if (!rows.length) return [];
    var head=rows[0].map(function(h){return h.trim().toLowerCase();});
    return rows.slice(1).map(function(r){ var o={}; head.forEach(function(h,j){ o[h]=(r[j]||'').trim(); }); return o; })
      .filter(function(o){ return Object.keys(o).some(function(k){ return o[k]; }); });
  }

  function load(tab, fallback, id){
    return fetch(sheetUrl(tab, id)).then(function(r){
      if (!r.ok) throw new Error('sheet ' + r.status);
      return r.text();
    }).then(function(t){
      if (/^\s*</.test(t)) throw new Error('sheet not public');
      var rows=parseCSV(t);
      if (!rows.length) throw new Error('empty');
      return rows;
    }).catch(function(err){
      if (window.console) console.warn('Using saved copy of "' + tab + '":', err.message);
      return fetch(fallback).then(function(r){ return r.json(); });
    });
  }

  function esc(s){ return String(s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function get(o, names){ for (var i=0;i<names.length;i++){ if (o[names[i]]) return o[names[i]]; } return ''; }

  // Turn Google Drive "view" links into direct, openable links
  function fixLink(u){
    var m = u.match(/drive\.google\.com\/file\/d\/([^/]+)/) || u.match(/drive\.google\.com\/open\?id=([^&]+)/);
    return m ? 'https://drive.google.com/file/d/' + m[1] + '/view' : u;
  }
  function fixImage(u){
    var m = u.match(/drive\.google\.com\/file\/d\/([^/]+)/) || u.match(/drive\.google\.com\/open\?id=([^&]+)/);
    return m ? 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w900' : u;
  }

  /* ---------- Free Resources ---------- */
  function renderResources(rows){
    var grid=document.getElementById('resource-grid'), html='', n=0;
    rows.forEach(function(r){
      var status=get(r,['status','show']).toLowerCase();
      if (status==='hide' || status==='no' || status==='hidden') return;
      // "Show on": Website (or blank), Launch page, or Both. Launch-page-only rows stay off this page.
      var where=get(r,['show on']).toLowerCase();
      if (where.indexOf('launch')>-1 && where.indexOf('both')<0) return;
      var title=get(r,['title']), sub=get(r,['subtitle','tagline']), link=get(r,['link','pdf','url']), img=get(r,['image','thumbnail']);
      if (!title) return;
      var soon = status.indexOf('soon')>-1;
      var media = img ? '<img src="'+esc(fixImage(img))+'" alt="" loading="lazy">'
                      : '<div class="titlecard c'+(n%3+1)+'">'+esc(title)+(sub?'<small>'+esc(sub)+'</small>':'')+'</div>';
      var body='<div class="body">'+(soon?'<span class="badge">Coming soon</span>':'')+'<h3>'+esc(title)+'</h3>'+(sub?'<p>'+esc(sub)+'</p>':'')+'</div>';
      if (link && !soon){
        var ext=/^https?:/.test(link) && link.indexOf(location.host)<0;
        html+='<a class="card" href="'+esc(fixLink(link))+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+media+body+'</a>';
      } else {
        html+='<div class="card">'+media+body+'</div>';
      }
      n++;
    });
    grid.innerHTML = html || '<p>Resources coming soon.</p>';
  }

  /* ---------- Weekly Topics ---------- */
  var MONTHS={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
  function parseDate(s){
    s=(s||'').trim(); if(!s) return null; var m;
    if ((m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return new Date(+m[1],+m[2]-1,+m[3]);
    if ((m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})/))) return new Date(+m[3]<100?2000+(+m[3]):+m[3],+m[1]-1,+m[2]);
    if ((m=s.match(/^(\d{1,2})\s+([A-Za-z]{3})[A-Za-z]*\.?,?\s+(\d{4})/))) return new Date(+m[3],MONTHS[m[2].toLowerCase()],+m[1]);
    if ((m=s.match(/^([A-Za-z]{3})[A-Za-z]*\.?\s+(\d{1,2}),?\s+(\d{4})/))) return new Date(+m[3],MONTHS[m[1].toLowerCase()],+m[2]);
    var d=new Date(s); return isNaN(d)?null:d;
  }
  function launchYear(d){ var y=d.getFullYear(); var start = d.getMonth()>=7 ? y : y-1; return 'Launch Year ' + start + ' - ' + (start+1); }
  function fmt(d){ return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}); }

  function dayKey(d){ return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
  // Links in the Wednesday sheet are written for the launch page (../summit/); make them work from here.
  function siteLink(u){ u=(u||'').trim(); if(!u) return ''; if(/^https?:/.test(u)) return fixLink(u); return u.replace(/^(\.\.\/)+/,''); }
  function wedImage(u){ u=(u||'').trim(); if(!u) return ''; if(/^https?:/.test(u)) return fixImage(u); return WED_IMAGES + u.replace(/^(\.\.\/)?ghana\/images\//,''); }

  function renderTopics(rows, wedRows){
    var groups={}, order=[], today=dayKey(new Date());
    function add(g, d, item){
      if(!groups[g]){ groups[g]={}; order.push(g); }
      var key = d ? dayKey(d) : '~';
      if(!groups[g][key]) groups[g][key]={date:d, items:[]};
      var list=groups[g][key].items, name=item.title.toLowerCase();
      for (var i=0;i<list.length;i++){ if(list[i].title.toLowerCase()===name){ if(!list[i].image) list[i]=item; return; } }
      list.push(item);
    }
    rows.forEach(function(r){
      var status=get(r,['status','show']).toLowerCase(); if (status==='hide'||status==='no') return;
      var topic=get(r,['topic','title']); if(!topic) return;
      var d=parseDate(get(r,['date']));
      add(get(r,['group','launch year']) || (d ? launchYear(d) : 'Other'), d, {title:topic});
    });
    (wedRows||[]).forEach(function(r){
      if (get(r,['show']).toLowerCase()==='no') return;
      var topic=get(r,['topic']); var d=parseDate(get(r,['date']));
      if(!topic || !d || dayKey(d)>today) return;   // undated or future rows are not archived yet
      add(launchYear(d), d, {title:topic, host:get(r,['host']), image:wedImage(get(r,['image (16:9)','image'])), link:siteLink(get(r,['button link (optional)','button link']))});
    });
    function yearOf(g){ var m=g.match(/(\d{4})/); return m?+m[1]:0; }
    // Newest first. Same year: the launch year (starting that August) comes before that year's summer
    order.sort(function(a,b){ return yearOf(b)-yearOf(a) || ((a.indexOf('Summer')>-1)-(b.indexOf('Summer')>-1)); });
    var tabs=document.getElementById('year-tabs'), list=document.getElementById('topic-list');
    tabs.innerHTML = order.map(function(g,i){ return '<button role="tab" aria-selected="'+(i===0)+'" data-g="'+esc(g)+'">'+esc(g)+'</button>'; }).join('');
    function card(t){
      var inner=(t.image?'<img src="'+esc(t.image)+'" alt="" loading="lazy">':'<div class="titlecard c1">'+esc(t.title)+'</div>')
        +'<h3>'+esc(t.title)+'</h3>'+(t.host?'<p>Hosted by '+esc(t.host)+'</p>':'');
      return t.link ? '<a class="topic-card" href="'+esc(t.link)+'"'+(/^https?:/.test(t.link)?' target="_blank" rel="noopener"':'')+'>'+inner+'</a>'
                    : '<div class="topic-card">'+inner+'</div>';
    }
    function show(g){
      var weeks=Object.keys(groups[g]).sort().reverse().map(function(k){ return groups[g][k]; });
      list.innerHTML = weeks.map(function(w){
        var pics=w.items.some(function(t){ return t.image || t.host; });
        var body = pics ? '<div class="topic-cards">'+w.items.map(card).join('')+'</div>'
                        : '<ul>'+w.items.map(function(t){return '<li>'+esc(t.title)+'</li>';}).join('')+'</ul>';
        return '<div class="topic-week'+(pics?' has-cards':'')+'"><time>'+(w.date?fmt(w.date):'')+'</time>'+body+'</div>';
      }).join('') || '<p>No topics listed yet.</p>';
      [].forEach.call(tabs.children,function(b){ b.setAttribute('aria-selected', b.getAttribute('data-g')===g); });
    }
    tabs.addEventListener('click',function(e){ var b=e.target.closest('button'); if(b) show(b.getAttribute('data-g')); });
    if(order.length) show(order[0]); else list.innerHTML='<p>No topics listed yet.</p>';
  }

  load(TABS.resources,'data/free-resources.json').then(renderResources);
  if (document.getElementById('topic-list')) Promise.all([
      load(TABS.topics,'data/weekly-topics.json'),
      load(WED_TAB,'data/wednesday-topics.json',WEEKLY_PAGES_ID)
    ]).then(function(r){ renderTopics(r[0], r[1]); });
})();

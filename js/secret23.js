/* Secret23: the interactive puzzle hunt.
   One guess per clue. A missed clue stays hidden until the player presses "Reveal".
   Answers are stored as hashes, so they can't be read from the page code.
   Progress is saved in this browser only (localStorage). */
(function(){
  var DATA = {"clues": [{"h": ["547c3a50fce007204045ec1f"], "c": "c2lyYVA="}, {"h": ["6b3977b89b79aef8e087328a", "9386b793fcee843f8078cc6a", "4a896c076567b460347b4659"], "c": "a3JvWSB3ZU4="}, {"h": ["55ed6de524e0b84ad6c9f181", "959d1d020ea7a994cfb60219"], "c": "ZW1vUg=="}, {"h": ["db5f4bab983f21c2dc355142"], "c": "b3JpYUM="}, {"h": ["9847e6a43b84591e0a6cdfb8", "bd8ec4829cc07affd2da5822"], "c": "Z25pamllQg=="}, {"h": ["fb8a5bd99bfa679dcf8770ec"], "c": "bHVibmF0c0k="}, {"h": ["7fe4afb849c66f83b71151cc"], "c": "YXJnQQ=="}, {"h": ["37f29e52cbd947889ad62c9e"], "c": "b3RveUs="}, {"h": ["0136c2fbb487b17ebe05a1eb", "ddc77d2433bcb36f0eadc71a"], "c": "aGdydWJuaWRF"}, {"h": ["fece9c2423eba73ec1a3ceff", "d246609265e73d7c3541a206"], "c": "c25laHRB"}, {"h": ["047e71034f45ac22deee354f", "e493841aa5e89930aadc1c37"], "c": "c2xsYUYgYXJhZ2FpTg=="}, {"h": ["31f2dd1cf8bf9488f86b3379"], "c": "aWFidUQ="}, {"h": ["54ebb1ed11f096a90e6915fa"], "c": "YXJ0ZVA="}, {"h": ["4ad24d089323da1db2f86976"], "c": "eWVuZHlT"}, {"h": ["4281be83e302d4aef8928024", "9742d5ecb663779d21fcb396"], "c": "b3JpZW5hSiBlZCBvaVI="}, {"h": ["09f2d5d98d44a3827d8c37f9", "48520dc160d14c6390894af8", "63790c965df73ae06839718e"], "c": "cGFlUiBtZWlT"}, {"h": ["148a675e9becf18810fa38c7", "418a1bd2453220bf90a5e0aa", "6959cd14807314d5c48d71b4"], "c": "eXRpQyBvY2l4ZU0="}, {"h": ["d9c30313024a7df86f105a91", "35af13bd67e26817b61aa6f9"], "c": "d29jc29N"}, {"h": ["3d950cdfc6c7e1b1a67431a7", "39fda8f9c272c7444a054670"], "c": "aHNla2FycmFN"}, {"h": ["ec60107cf12f3e5304e8c2ed"], "c": "b2xzTw=="}], "final": "eb35de28bf37b98f0354e2d6"};
  var KEY = 'lp23-secret23';
  var state = load();
  function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || {c:{}, done:false}; } catch(e){ return {c:{}, done:false}; } }
  function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){} }
  function letters(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z]/g,''); }
  function norm(s){ return letters(s).replace(/^the/,''); }  // city guesses: a leading "The" doesn't matter
  function hash(s){
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function(b){
      return Array.prototype.map.call(new Uint8Array(b), function(x){ return ('0'+x.toString(16)).slice(-2); }).join('').slice(0,24);
    });
  }
  function city(i){ return decodeURIComponent(escape(atob(DATA.clues[i].c))).split('').reverse().join(''); }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  var grid = document.getElementById('s23-clues');
  function cardHTML(i){
    var st = state.c[i] || {}, n = i+1, foot;
    if (st.ok) foot = '<p class="s23-res ok">&#10003; '+esc(city(i))+'</p>';
    else if (st.miss && st.shown) foot = '<p class="s23-res miss">Not quite. The city: <b>'+esc(city(i))+'</b></p>';
    else if (st.miss) foot = '<p class="s23-res miss">Not quite. This clue is locked.</p><button type="button" class="btn btn-ghost btn-small s23-reveal" data-i="'+i+'">Reveal the city</button>';
    else foot = '<form class="s23-guess" data-i="'+i+'"><label class="sr-only" for="g'+n+'">Your guess for clue '+n+'</label><input id="g'+n+'" autocomplete="off" placeholder="Which city?" required><button class="btn btn-small">Guess</button></form>';
    return '<figure class="s23-card'+(st.ok?' is-ok':st.miss?' is-miss':'')+'" id="clue-'+n+'"><a href="img/secret23/clue-'+('0'+n).slice(-2)+'.webp" target="_blank" rel="noopener" title="Open full size"><img src="img/secret23/clue-'+('0'+n).slice(-2)+'.webp" alt="Secret23 clue '+n+'" loading="lazy"></a><figcaption><b>Clue '+n+'</b>'+foot+'</figcaption></figure>';
  }
  function render(){
    grid.innerHTML = DATA.clues.map(function(_,i){ return cardHTML(i); }).join('');
    var found = DATA.clues.filter(function(_,i){ return state.c[i] && state.c[i].ok; }).length;
    var used = DATA.clues.filter(function(_,i){ return state.c[i] && (state.c[i].ok || state.c[i].miss); }).length;
    document.getElementById('s23-score').textContent = found + ' of 20 cities found' + (used>found ? ' (' + (used-found) + ' missed)' : '');
    document.getElementById('s23-bar').style.width = (used*5) + '%';
    var fin = document.getElementById('s23-final-result');
    if (state.done){ document.getElementById('s23-final-form').hidden = true; fin.innerHTML = '<div class="s23-win"><p class="s23-win-label">You divined it:</p><p class="s23-win-msg">The future needs you now.</p></div>'; }
  }
  grid.addEventListener('submit', function(e){
    var f = e.target.closest('.s23-guess'); if (!f) return; e.preventDefault();
    var i = +f.getAttribute('data-i'), g = norm(f.querySelector('input').value); if (!g) return;
    f.querySelector('button').disabled = true;
    hash('s23|'+(i+1)+'|'+g).then(function(h){
      state.c[i] = DATA.clues[i].h.indexOf(h) > -1 ? {ok:true} : {miss:true};
      save(); render();
      var card = document.getElementById('clue-'+(i+1)); if (card) card.querySelector('figcaption').focus && card.scrollIntoView({block:'nearest'});
    });
  });
  grid.addEventListener('click', function(e){
    var b = e.target.closest('.s23-reveal'); if (!b) return;
    var i = +b.getAttribute('data-i'); state.c[i].shown = true; save(); render();
  });
  document.getElementById('s23-final-form').addEventListener('submit', function(e){
    e.preventDefault(); var inp = document.getElementById('s23-final'), out = document.getElementById('s23-final-result');
    hash('s23|final|'+letters(inp.value)).then(function(h){
      if (h === DATA.final){ state.done = true; save(); render(); }
      else out.innerHTML = '<p class="s23-res miss">Not yet. Keep decoding!</p>';
    });
  });
  var reset = document.getElementById('s23-reset');
  reset.addEventListener('click', function(){
    if (reset.getAttribute('data-sure') !== '1'){ reset.setAttribute('data-sure','1'); reset.textContent = 'Click again to erase your progress'; return; }
    state = {c:{}, done:false}; save(); reset.removeAttribute('data-sure'); reset.textContent = 'Start over';
    document.getElementById('s23-final-form').hidden = false; document.getElementById('s23-final-result').innerHTML=''; document.getElementById('s23-final').value=''; render();
  });
  render();
})();

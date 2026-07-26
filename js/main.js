(function(){
  var key = 'sp_offer_deadline';
  var durationMs = 15 * 60 * 1000;
  var deadline = sessionStorage.getItem(key);
  if(!deadline){
    deadline = Date.now() + durationMs;
    sessionStorage.setItem(key, deadline);
  } else {
    deadline = parseInt(deadline, 10);
  }
  var clock = document.getElementById('clock');
  function tick(){
    var remaining = deadline - Date.now();
    if(remaining <= 0){
      deadline = Date.now() + durationMs;
      sessionStorage.setItem(key, deadline);
      remaining = durationMs;
    }
    var m = Math.floor(remaining / 60000);
    var s = Math.floor((remaining % 60000) / 1000);
    clock.textContent = (m<10?'0':'')+m+':'+(s<10?'0':'')+s;
  }
  tick();
  setInterval(tick, 1000);
})();

(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if(!targets.length) return;

  function showAll(){
    targets.forEach(function(el){ el.classList.add('is-visible'); });
  }

  if(reduceMotion || !('IntersectionObserver' in window)){
    showAll();
    return;
  }

  // Elementos que já chegam visíveis (ex.: link direto para uma âncora
  // no meio da página) não devem depender do observer — aparecem de imediato.
  var pending = [];
  targets.forEach(function(el){
    var rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight && rect.bottom > 0){
      el.classList.add('is-visible');
    } else {
      pending.push(el);
    }
  });

  if(!pending.length) return;

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  pending.forEach(function(el){ observer.observe(el); });

  // Rede de segurança: se por qualquer motivo o observer não disparar
  // para algum elemento (ex.: navegação atípica), garante que o
  // conteúdo nunca fique invisível permanentemente.
  setTimeout(function(){
    showAll();
    observer.disconnect();
  }, 4000);
})();

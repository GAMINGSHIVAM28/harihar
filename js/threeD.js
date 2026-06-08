// threeD.js — lightweight 3D interactions, tilt and reveal
(function(){
  if (typeof window === 'undefined') return;

  const isMobile = () => window.innerWidth <= 600;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create hero animation scene if missing and ensure hero-inner wrapper exists
  function ensureHeroScene(){
    const hero = document.querySelector('.hero');
    if (!hero) return;
    // Create hero-inner wrapper if missing (keeps transforms isolated)
    if (!hero.querySelector('.hero-inner')){
      const wrapper = document.createElement('div');
      wrapper.className = 'hero-inner';
      // Move existing children into wrapper
      while (hero.firstChild){
        wrapper.appendChild(hero.firstChild);
      }
      hero.appendChild(wrapper);
    }

    if (hero.querySelector('.hero-animation-scene')) return; // already exists

    const scene = document.createElement('div');
    scene.className = 'hero-animation-scene';
    scene.setAttribute('aria-hidden','true');

    // positions are relative; JS-driven transforms
    const box = document.createElement('div'); box.className = 'float-item box'; box.dataset.float = '1.0'; box.style.left = '10%'; box.style.top = '18%';
    const pill = document.createElement('div'); pill.className = 'float-item pill'; pill.dataset.float = '0.6'; pill.style.left = '78%'; pill.style.top = '28%';
    const cross = document.createElement('div'); cross.className = 'float-item cross'; cross.dataset.float = '1.3'; cross.style.left = '50%'; cross.style.top = '6%'; cross.textContent = '+';
    const mini1 = document.createElement('div'); mini1.className = 'float-item mini-card'; mini1.dataset.float = '0.8'; mini1.style.left = '28%'; mini1.style.top = '50%';
    const mini2 = document.createElement('div'); mini2.className = 'float-item mini-card'; mini2.dataset.float = '1.4'; mini2.style.left = '66%'; mini2.style.top = '54%';

    scene.appendChild(box); scene.appendChild(pill); scene.appendChild(cross); scene.appendChild(mini1); scene.appendChild(mini2);
    // Insert scene at top of hero content (so it sits behind wrapper visually)
    hero.insertAdjacentElement('afterbegin', scene);
  }

  // Tilt effect for cards
  function bindCardTilt(){
    if (prefersReduced || isMobile()) return;
    const cards = new WeakMap();

    function onEnter(e){
      const el = e.currentTarget;
      el.classList.add('tilt-active');
    }
    function onMove(e){
      const el = e.currentTarget;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -10; // rotateX
      const ry = (px - 0.5) * 12; // rotateY
      const transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      el.style.transform = transform;
      // slight inner pop
      const image = el.querySelector('.card-image');
      if (image) image.style.transform = `translateZ(22px) translateY(-4px)`;
    }
    function onLeave(e){
      const el = e.currentTarget;
      el.classList.remove('tilt-active');
      el.style.transform = '';
      const image = el.querySelector('.card-image');
      if (image) image.style.transform = '';
    }

    document.querySelectorAll('.card.product-card').forEach(c => {
      c.addEventListener('pointerenter', onEnter);
      c.addEventListener('pointermove', onMove);
      c.addEventListener('pointerleave', onLeave);
    });
  }

  // IntersectionObserver for reveals
  function bindRevealObserver(){
    if (prefersReduced) return;
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          entry.target.classList.add('reveal-visible');
        }
      });
    },{threshold:0.12});

    document.querySelectorAll('.asset-fade').forEach(el=>{
      el.classList.add('asset-fade'); // ensure class exists
      observer.observe(el);
    });
  }

  // Simple parallax for hero on pointermove — for desktop only, and non-reduced motion
  function bindHeroParallax(){
    if (prefersReduced) return;
    const hero = document.querySelector('.hero');
    const scene = hero && hero.querySelector('.hero-animation-scene');
    if (!hero || !scene) return;
    if (isMobile()) return;

    let frame = null;
    hero.addEventListener('pointermove', (ev)=>{
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(()=>{
        const rect = hero.getBoundingClientRect();
        const x = (ev.clientX - rect.left) / rect.width - 0.5;
        const y = (ev.clientY - rect.top) / rect.height - 0.5;
        const rotY = x * 4; const rotX = -y * 3;
        scene.style.transform = `translateZ(0) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    });
    hero.addEventListener('pointerleave', ()=>{ scene.style.transform = ''; });
  }

  // Attach filter button micro-interactions (non-invasive)
  function enhanceFilterButtons(){
    document.querySelectorAll('.filter-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        btn.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:260,easing:'cubic-bezier(.2,.9,.2,1)'});
      });
    });
    // search focus micro-lift
    const search = document.querySelector('.search-wrapper input');
    if (search){
      search.addEventListener('focus', ()=> search.classList.add('search-focus'));
      search.addEventListener('blur', ()=> search.classList.remove('search-focus'));
    }
  }

  // Re-bind when inventory updates (mutation observer for medicine-grid)
  function observeGridMutations(){
    const grid = document.getElementById('medicine-grid');
    if (!grid) return;
    const mo = new MutationObserver(()=>{
      // small timeout to let DOM stabilize
      setTimeout(()=>{
        bindCardTilt();
        // observe new items for reveal
        document.querySelectorAll('.asset-fade').forEach(el=>el.classList.remove('reveal-visible'));
        bindRevealObserver();
      }, 60);
    });
    mo.observe(grid, {childList:true, subtree:true});
  }

  // Init all
  function init(){
    ensureHeroScene();
    bindRevealObserver();
    bindHeroParallax();
    bindCardTilt();
    enhanceFilterButtons();
    observeGridMutations();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

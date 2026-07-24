/* ==========================================================
   SETUP
   ========================================================== */
gsap.registerPlugin(ScrollTrigger);
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==========================================================
   PRELOADER
   ========================================================== */
(function preload(){
  const fill = document.getElementById('preloader-fill');
  const pct = document.getElementById('preloader-pct');
  const pre = document.getElementById('preloader');
  let p = 0;
  const iv = setInterval(()=>{
    p += Math.random()*18;
    if(p >= 100){ p = 100; clearInterval(iv); }
    fill.style.width = p + '%';
    pct.textContent = String(Math.floor(p)).padStart(2,'0') + '%';
    if(p === 100){
      setTimeout(()=>{
        pre.classList.add('done');
        document.body.style.cursor = 'none';
        playIntro();
      }, 250);
    }
  }, 90);
})();

/* ==========================================================
   CUSTOM CURSOR
   ========================================================== */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = innerWidth/2, mouseY = innerHeight/2;
let ringX = mouseX, ringY = mouseY;

window.addEventListener('mousemove', (e)=>{
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
});
(function ringLoop(){
  ringX += (mouseX - ringX) * 0.16;
  ringY += (mouseY - ringY) * 0.16;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
  requestAnimationFrame(ringLoop);
})();
document.querySelectorAll('a, button, [data-tilt]').forEach(el=>{
  el.addEventListener('mouseenter', ()=>cursorRing.classList.add('hovering'));
  el.addEventListener('mouseleave', ()=>cursorRing.classList.remove('hovering'));
});

/* ==========================================================
   HUD
   ========================================================== */
const hudPos = document.getElementById('hudPos');
const hudScroll = document.getElementById('hudScroll');
const hudScene = document.getElementById('hudScene');
const hudGizmo = document.getElementById('hudGizmo');

window.addEventListener('mousemove', (e)=>{
  const nx = (e.clientX / innerWidth - 0.5) * 2;
  const ny = (e.clientY / innerHeight - 0.5) * -2;
  hudPos.textContent = `X ${nx.toFixed(2)} \u00A0 Y ${ny.toFixed(2)}`;
  hudGizmo.style.transform = `rotate(${nx*14}deg)`;
});

const sceneNames = {hero:'LAYER_00 · HERO', about:'LAYER_01 · ABOUT', work:'LAYER_02 · WORK', craft:'LAYER_03 · CRAFT', contact:'LAYER_04 · CONTACT'};
Object.keys(sceneNames).forEach(id=>{
  ScrollTrigger.create({
    trigger: `#${id}`, start:'top center', end:'bottom center',
    onEnter: ()=> hudScene.textContent = sceneNames[id],
    onEnterBack: ()=> hudScene.textContent = sceneNames[id],
  });
});

ScrollTrigger.create({
  trigger: document.body, start:'top top', end:'bottom bottom',
  onUpdate: self => { hudScroll.textContent = String(Math.round(self.progress*100)).padStart(3,'0') + '%'; }
});

/* ==========================================================
   INTRO REVEAL (cinematic page-load sequence)
   ========================================================== */
function playIntro(){
  const tl = gsap.timeline({defaults:{ease:'power3.out'}});
  tl.to('[data-reveal]', { opacity:1, y:0, duration:1.1, stagger:0.12 }, 0.1);
}

/* ==========================================================
   SCROLL REVEALS
   ========================================================== */
gsap.utils.toArray('[data-fade]').forEach(el=>{
  gsap.to(el, {
    opacity:1, y:0, duration:1, ease:'power3.out',
    scrollTrigger:{ trigger:el, start:'top 85%' }
  });
});

gsap.utils.toArray('.reveal-lines span').forEach((line,i)=>{
  gsap.fromTo(line, {yPercent:110}, {
    yPercent:0, duration:1, ease:'power4.out', delay:i*0.08,
    scrollTrigger:{ trigger: line, start:'top 88%' }
  });
});

/* stat counters */
gsap.utils.toArray('.stat-num').forEach(el=>{
  const target = +el.dataset.count;
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter:()=>{
      let obj = {v:0};
      gsap.to(obj, { v: target, duration:1.6, ease:'power2.out', onUpdate:()=>{ el.textContent = Math.round(obj.v); } });
    }
  });
});

/* section labels subtle parallax */
gsap.utils.toArray('.section-label').forEach(el=>{
  gsap.fromTo(el, {opacity:0, x:-20}, {
    opacity:1, x:0, duration:1, ease:'power3.out',
    scrollTrigger:{ trigger:el, start:'top 85%' }
  });
});

/* project card entrance + parallax tilt */
gsap.utils.toArray('.project').forEach((proj, i)=>{
  gsap.fromTo(proj, {opacity:0, y:60}, {
    opacity:1, y:0, duration:1.1, ease:'power3.out',
    scrollTrigger:{ trigger:proj, start:'top 82%' }
  });
});
document.querySelectorAll('[data-tilt]').forEach(card=>{
  const visual = card.querySelector('.project-visual');
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - 0.5;
    const py = (e.clientY - r.top)/r.height - 0.5;
    gsap.to(visual, { rotateY: px*10, rotateX: -py*10, duration:0.6, ease:'power2.out', transformPerspective:800 });
  });
  card.addEventListener('mouseleave', ()=>{
    gsap.to(visual, { rotateY:0, rotateX:0, duration:0.8, ease:'power3.out' });
  });
});

/* craft cards */
gsap.utils.toArray('.craft-card').forEach((c,i)=>{
  gsap.fromTo(c, {opacity:0, y:30}, {
    opacity:1, y:0, duration:0.8, delay:i*0.05, ease:'power3.out',
    scrollTrigger:{ trigger: c.parentElement, start:'top 80%' }
  });
});

/* contact reveal */
gsap.fromTo('.contact-inner', {opacity:0, y:40}, {
  opacity:1, y:0, duration:1.2, ease:'power3.out',
  scrollTrigger:{ trigger:'.contact', start:'top 70%' }
});

/* nav active link (simple) */
document.querySelectorAll('[data-nav]').forEach(link=>{
  link.addEventListener('click', e=>{
    e.preventDefault();
    document.querySelector(link.getAttribute('href'))?.scrollIntoView({behavior:'smooth'});
  });
});

/* ==========================================================
   THREE.JS — PERSISTENT SITE-WIDE BACKGROUND
   Soft glassy/cloud-like orbs drifting behind every section,
   with slow parallax tied to scroll + pointer position.
   ========================================================== */
(function siteBackground(){
  const canvas = document.getElementById('webgl-bg');
  if(!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 100);
  camera.position.z = 14;

  /* soft radial-gradient sprite texture = the "glassy cloud" look */
  function makeCloudTexture(hex){
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(128,128,0,128,128,128);
    g.addColorStop(0, hex + 'ff');
    g.addColorStop(0.35, hex + '88');
    g.addColorStop(1, hex + '00');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,256,256);
    return new THREE.CanvasTexture(c);
  }

  const palette = ['#7c5cff', '#5ce1ff', '#ff6b4a'];
  const texByColor = palette.map(makeCloudTexture);

  const total = reduceMotion ? 10 : 26;
  const clouds = [];
  const docHeight = ()=> document.body.scrollHeight;

  for(let i=0;i<total;i++){
    const tex = texByColor[i % texByColor.length];
    const mat = new THREE.SpriteMaterial({ map:tex, transparent:true, opacity: 0.16 + Math.random()*0.16, depthWrite:false });
    const sprite = new THREE.Sprite(mat);
    const scale = 4 + Math.random()*7;
    sprite.scale.set(scale, scale, 1);
    sprite.position.set(
      (Math.random()-0.5) * 26,
      -Math.random() * (docHeight()/innerHeight) * 16,
      -6 - Math.random()*10
    );
    sprite.userData = {
      driftX: (Math.random()-0.5)*0.06,
      baseY: sprite.position.y,
      floatAmp: 0.6 + Math.random()*0.8,
      floatSpeed: 0.15 + Math.random()*0.25,
      phase: Math.random()*Math.PI*2
    };
    scene.add(sprite);
    clouds.push(sprite);
  }

  let mx = 0, my = 0;
  window.addEventListener('mousemove', e=>{
    mx = (e.clientX/innerWidth - 0.5);
    my = (e.clientY/innerHeight - 0.5);
  });

  let scrollProgress = 0;
  ScrollTrigger.create({
    trigger: document.body, start:'top top', end:'bottom bottom',
    onUpdate: self => { scrollProgress = self.progress; }
  });

  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();

    /* the whole cloud field scrolls upward with the page for full-site parallax depth */
    const scrollOffset = scrollProgress * (docHeight()/innerHeight) * 16;

    clouds.forEach(s=>{
      const u = s.userData;
      s.position.x = (s.position.x + u.driftX*0.01);
      s.position.y = u.baseY + Math.sin(t*u.floatSpeed + u.phase) * u.floatAmp + scrollOffset;
    });

    camera.position.x += ( mx*1.4 - camera.position.x ) * 0.03;
    camera.position.y += ( -my*1.0 - camera.position.y ) * 0.03;
    camera.lookAt(0,0,0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ==========================================================
   THREE.JS — HERO SCENE
   ========================================================== */
(function heroScene(){
  const canvas = document.getElementById('webgl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0,0,9);

  // Ambient particle field
  const starCount = reduceMotion ? 400 : 1400;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount*3);
  for(let i=0;i<starCount;i++){
    const r = 6 + Math.random()*14;
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos((Math.random()*2)-1);
    starPos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
    starPos[i*3+1] = r*Math.sin(phi)*Math.sin(theta);
    starPos[i*3+2] = r*Math.cos(phi) - 6;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos,3));
  const starMat = new THREE.PointsMaterial({ color:0x7c5cff, size:0.035, transparent:true, opacity:0.75 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  const starMat2 = new THREE.PointsMaterial({ color:0x5ce1ff, size:0.022, transparent:true, opacity:0.55 });
  const stars2 = new THREE.Points(starGeo, starMat2);
  stars2.rotation.set(0.4,0.4,0);
  scene.add(stars2);

  // Central sculptural form: icosahedron core + wireframe shell
  const group = new THREE.Group();
  scene.add(group);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 1),
    new THREE.MeshStandardMaterial({ color:0x0b0e17, metalness:0.4, roughness:0.25, emissive:0x1a1030, emissiveIntensity:0.6, flatShading:true })
  );
  group.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.35, 1),
    new THREE.MeshBasicMaterial({ color:0x7c5cff, wireframe:true, transparent:true, opacity:0.5 })
  );
  group.add(wire);

  const wire2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(3.0, 0),
    new THREE.MeshBasicMaterial({ color:0x5ce1ff, wireframe:true, transparent:true, opacity:0.18 })
  );
  group.add(wire2);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.6, 0.006, 8, 128),
    new THREE.MeshBasicMaterial({ color:0xff6b4a, transparent:true, opacity:0.5 })
  );
  ring.rotation.x = Math.PI/2.4;
  group.add(ring);

  const light1 = new THREE.PointLight(0x7c5cff, 30, 20);
  light1.position.set(4,3,4);
  scene.add(light1);
  const light2 = new THREE.PointLight(0x5ce1ff, 18, 20);
  light2.position.set(-4,-2,3);
  scene.add(light2);
  scene.add(new THREE.AmbientLight(0x2a2a40, 1.2));

  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e=>{
    targetX = (e.clientX/innerWidth - 0.5);
    targetY = (e.clientY/innerHeight - 0.5);
  });

  // parallax with scroll
  ScrollTrigger.create({
    trigger:'#hero', start:'top top', end:'bottom top',
    onUpdate: self => { group.position.y = -self.progress*1.6; camera.position.z = 9 - self.progress*1.2; }
  });

  const clock = new THREE.Clock();
  function animate(){
    const t = clock.getElapsedTime();
    group.rotation.y = t*0.12 + targetX*0.6;
    group.rotation.x = t*0.05 + targetY*0.4;
    ring.rotation.z = t*0.2;
    stars.rotation.y = t*0.01;
    stars2.rotation.y = -t*0.008;
    core.material.emissiveIntensity = 0.5 + Math.sin(t*0.8)*0.15;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();

/* ==========================================================
   THREE.JS — MINI PROJECT SCENES
   ========================================================== */
function makeMiniRenderer(canvas){
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const resize = ()=>{
    const r = canvas.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
  };
  resize();
  window.addEventListener('resize', resize);
  return { renderer, resize };
}

/* --- Terrain mini scene --- */
(function terrainScene(){
  const canvas = document.querySelector('[data-scene="terrain"]');
  if(!canvas) return;
  const { renderer, resize } = makeMiniRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0, 2.6, 5.2);
  camera.lookAt(0,0,0);

  const size = 6, seg = 42;
  const geo = new THREE.PlaneGeometry(size, size, seg, seg);
  const pos = geo.attributes.position;
  for(let i=0;i<pos.count;i++){
    const x = pos.getX(i), y = pos.getY(i);
    const h = Math.sin(x*0.9)*0.35 + Math.cos(y*0.7)*0.3 + Math.sin((x+y)*0.5)*0.2;
    pos.setZ(i, h);
  }
  geo.computeVertexNormals();
  geo.rotateX(-Math.PI/2.4);
  const mat = new THREE.MeshBasicMaterial({ color:0x7c5cff, wireframe:true, transparent:true, opacity:0.55 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const dotGeo = new THREE.BufferGeometry();
  const n = 60; const dp = new Float32Array(n*3);
  for(let i=0;i<n;i++){ dp[i*3]=(Math.random()-0.5)*size; dp[i*3+1]=Math.random()*1.4; dp[i*3+2]=(Math.random()-0.5)*size; }
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dp,3));
  const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color:0x5ce1ff, size:0.05 }));
  scene.add(dots);

  const clock = new THREE.Clock();
  function loop(){
    const t = clock.getElapsedTime();
    mesh.rotation.y = t*0.15;
    dots.rotation.y = t*0.15;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
  new ResizeObserver(resize).observe(canvas);
})();

/* --- Particles mini scene --- */
(function particlesScene(){
  const canvas = document.querySelector('[data-scene="particles"]');
  if(!canvas) return;
  const { renderer, resize } = makeMiniRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.z = 5;

  const count = 500;
  const geo = new THREE.BufferGeometry();
  const p = new Float32Array(count*3);
  const speeds = new Float32Array(count);
  for(let i=0;i<count;i++){
    p[i*3] = (Math.random()-0.5)*6;
    p[i*3+1] = (Math.random()-0.5)*6;
    p[i*3+2] = (Math.random()-0.5)*6;
    speeds[i] = 0.2+Math.random()*0.6;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(p,3));
  const mat = new THREE.PointsMaterial({ color:0x5ce1ff, size:0.045, transparent:true, opacity:0.85 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const core = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.9,0.28,120,16),
    new THREE.MeshBasicMaterial({ color:0xff6b4a, wireframe:true, transparent:true, opacity:0.6 })
  );
  scene.add(core);

  const clock = new THREE.Clock();
  function loop(){
    const t = clock.getElapsedTime();
    points.rotation.y = t*0.08;
    core.rotation.x = t*0.3;
    core.rotation.y = t*0.22;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
  new ResizeObserver(resize).observe(canvas);
})();

/* --- Grid mini scene --- */
(function gridScene(){
  const canvas = document.querySelector('[data-scene="grid"]');
  if(!canvas) return;
  const { renderer, resize } = makeMiniRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.set(0,1.8,4.6);
  camera.lookAt(0,0,0);

  const grid = new THREE.GridHelper(6, 24, 0x7c5cff, 0x2a2d3a);
  scene.add(grid);

  const group = new THREE.Group();
  for(let i=0;i<24;i++){
    const h = 0.2+Math.random()*1.1;
    const geo = new THREE.BoxGeometry(0.16,h,0.16);
    const mat = new THREE.MeshBasicMaterial({ color: i%3===0?0xff6b4a:0x5ce1ff, transparent:true, opacity:0.75 });
    const box = new THREE.Mesh(geo,mat);
    box.position.set((Math.random()-0.5)*5, h/2, (Math.random()-0.5)*5);
    group.add(box);
  }
  scene.add(group);

  const clock = new THREE.Clock();
  function loop(){
    const t = clock.getElapsedTime();
    group.rotation.y = t*0.1;
    grid.rotation.y = t*0.1;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
  new ResizeObserver(resize).observe(canvas);
})();

/* ==========================================================
   THREE.JS — CONTACT SCENE
   ========================================================== */
(function contactScene(){
  const canvas = document.getElementById('webgl-contact');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  const resize = ()=>{ renderer.setSize(canvas.clientWidth, canvas.clientHeight, false); };
  resize();

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.z = 6;

  const geo = new THREE.IcosahedronGeometry(2, 4);
  const posAttr = geo.attributes.position;
  const base = posAttr.array.slice();

  const mat = new THREE.MeshBasicMaterial({ color:0x7c5cff, wireframe:true, transparent:true, opacity:0.35 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const clock = new THREE.Clock();
  function loop(){
    const t = clock.getElapsedTime();
    for(let i=0;i<posAttr.count;i++){
      const ix = i*3;
      const x = base[ix], y = base[ix+1], z = base[ix+2];
      const n = Math.sin(x*1.4 + t*0.6) * Math.cos(y*1.4 + t*0.4) * 0.14;
      const len = Math.sqrt(x*x+y*y+z*z) || 1;
      posAttr.setXYZ(i, x + (x/len)*n, y + (y/len)*n, z + (z/len)*n);
    }
    posAttr.needsUpdate = true;
    mesh.rotation.y = t*0.08;
    mesh.rotation.x = t*0.04;
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  }
  loop();
  new ResizeObserver(resize).observe(canvas);
})();

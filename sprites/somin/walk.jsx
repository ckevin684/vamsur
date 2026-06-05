/* Pixel walk-cycle: cut the legs off the sprite, alternate a step-lift while the
   planted leg stretches to keep its foot grounded, and bob the torso a few art-pixels. */

const SRC = 'sprite.png';
const ART      = 10;   // one art-pixel ~ 10 real px
const SPLIT_Y  = 540;  // legs cut below this row (pelvis line)
const LEG_X0   = 278;
const LEG_MID  = 378;  // gap between the legs
const LEG_X1   = 476;
const FOOT_Y   = 616;  // ground line where feet rest

let useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakToggle;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "pace": 1,
  "bobArt": 2,
  "liftArt": 3,
  "swayArt": 1,
  "mode": "walk",
  "snap": true,
  "shadow": true,
  "scenery": "grass",
  "zoom": 1
}/*EDITMODE-END*/;

function makeLayer(img, drawFn){
  const cv = document.createElement('canvas');
  cv.width = img.width; cv.height = img.height;
  drawFn(cv.getContext('2d'), cv);
  return cv;
}

function App(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const tRef = React.useRef(t); tRef.current = t;
  const [ready, setReady] = React.useState(false);
  const layers = React.useRef(null);

  React.useEffect(() => {
    const stage = document.getElementById('stage');
    stage.className = 'bg-' + ({grass:'grass',dark:'dark',flat:'flat',check:'check'}[t.scenery] || 'grass');
  }, [t.scenery]);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const W = img.width, H = img.height;
      const base = makeLayer(img, (cx) => { cx.drawImage(img,0,0); cx.clearRect(LEG_X0,SPLIT_Y,LEG_X1-LEG_X0,H-SPLIT_Y); });
      const legL = makeLayer(img, (cx) => { cx.save();cx.beginPath();cx.rect(LEG_X0,SPLIT_Y,LEG_MID-LEG_X0,H-SPLIT_Y);cx.clip();cx.drawImage(img,0,0);cx.restore(); });
      const legR = makeLayer(img, (cx) => { cx.save();cx.beginPath();cx.rect(LEG_MID,SPLIT_Y,LEG_X1-LEG_MID,H-SPLIT_Y);cx.clip();cx.drawImage(img,0,0);cx.restore(); });
      layers.current = { base, legL, legR, W, H };
      setReady(true);
    };
    img.src = SRC;
  }, []);

  React.useEffect(() => {
    if(!ready) return;
    const { base, legL, legR, W, H } = layers.current;
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let zoom = 0;
    function size(){
      const z = tRef.current.zoom;
      if(z === zoom) return;
      zoom = z;
      canvas.width = Math.round(W*dpr); canvas.height = Math.round(H*dpr);
      canvas.style.width = (W*z)+'px'; canvas.style.height = (H*z)+'px';
    }

    let raf, last = performance.now();
    let phase = parseFloat(sessionStorage.getItem('walkPhase')) || 0;
    const snap = (v) => tRef.current.snap ? Math.round(v/(ART/2))*(ART/2) : v;

    function drawLeg(layer, lift, hipDx, bobN){
      const tw = tRef.current;
      const hipY  = SPLIT_Y - tw.bobArt*ART*bobN;
      const footY = FOOT_Y - snap(tw.liftArt*ART*lift);
      const scaleY = (footY - hipY) / (FOOT_Y - SPLIT_Y);
      ctx.save();
      ctx.translate(hipDx, hipY); ctx.scale(1, scaleY); ctx.translate(0, -SPLIT_Y);
      ctx.drawImage(layer, 0, 0);
      ctx.restore();
    }

    function frame(now){
      const tw = tRef.current;
      size();
      const dt = (now - last)/1000; last = now;
      phase = (phase + dt*tw.pace) % 1;
      sessionStorage.setItem('walkPhase', phase);
      const a = phase * Math.PI * 2;

      ctx.setTransform(dpr,0,0,dpr,0,0);
      ctx.clearRect(0,0,W,H);
      ctx.imageSmoothingEnabled = false;

      const bobN = Math.pow(Math.sin(a), 2);          // two bobs per cycle
      const bobPx = snap(-tw.bobArt*ART*bobN);
      let leftUp, rightUp, sway;
      if(tw.mode === 'bob'){
        leftUp = rightUp = 0;
        sway = Math.sin(a) * tw.swayArt*ART*0.5;
      } else {
        leftUp  = Math.max(0,  Math.sin(a));
        rightUp = Math.max(0, -Math.sin(a));
        sway = Math.sin(a) * tw.swayArt*ART;
      }

      if(tw.shadow){
        const tighten = 1 - 0.16*bobN;
        ctx.save(); ctx.globalAlpha = 0.30; ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.ellipse(372, FOOT_Y+6, 96*tighten, 17*tighten, 0, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }

      if(tw.mode === 'bob'){
        ctx.save(); ctx.translate(sway, bobPx);
        ctx.drawImage(base,0,0); ctx.drawImage(legL,0,0); ctx.drawImage(legR,0,0);
        ctx.restore();
      } else {
        drawLeg(legL, leftUp,  sway, bobN);
        drawLeg(legR, rightUp, sway, bobN);
        ctx.save(); ctx.translate(sway, bobPx); ctx.drawImage(base,0,0); ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    }
    frame(performance.now());                          // paint immediately, then self-schedule
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <TweaksPanel title="Walk">
      <TweakSection label="Tempo" />
      <TweakSlider label="Pace" value={t.pace} min={0.3} max={3.2} step={0.05} unit="×" onChange={(v)=>setTweak('pace',v)} />
      <TweakRadio label="Style" value={t.mode} options={['walk','bob']} onChange={(v)=>setTweak('mode',v)} />

      <TweakSection label="Motion (art-pixels)" />
      <TweakSlider label="Body bob" value={t.bobArt} min={0} max={6} step={0.5} onChange={(v)=>setTweak('bobArt',v)} />
      <TweakSlider label="Foot lift" value={t.liftArt} min={0} max={6} step={0.5} onChange={(v)=>setTweak('liftArt',v)} />
      <TweakSlider label="Sway" value={t.swayArt} min={0} max={4} step={0.5} onChange={(v)=>setTweak('swayArt',v)} />
      <TweakToggle label="Pixel snap" value={t.snap} onChange={(v)=>setTweak('snap',v)} />

      <TweakSection label="Scene" />
      <TweakRadio label="Ground" value={t.scenery} options={['grass','dark','flat','check']} onChange={(v)=>setTweak('scenery',v)} />
      <TweakToggle label="Shadow" value={t.shadow} onChange={(v)=>setTweak('shadow',v)} />
      <TweakSlider label="Zoom" value={t.zoom} min={0.6} max={1.8} step={0.05} unit="×" onChange={(v)=>setTweak('zoom',v)} />
    </TweaksPanel>
  );
}

function boot(){
  if(!window.useTweaks || !window.TweaksPanel){ setTimeout(boot, 25); return; }
  ({ useTweaks, TweaksPanel, TweakSection, TweakSlider, TweakRadio, TweakToggle } = window);
  ReactDOM.createRoot(document.getElementById('panel-root')).render(<App />);
}
boot();

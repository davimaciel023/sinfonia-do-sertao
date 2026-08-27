import { useEffect, useRef } from "react";
import MagneticButton from "./MagneticButton";
import "./Hero.css";

/* ------------------------------------------------------------------
   Hero fotográfico com scroll-scrub: a foto do observador lendo o céu
   sofre um Ken Burns lento (zoom + parallax) e uma camada de chuva
   desenhada em <canvas> ganha intensidade conforme a rolagem avança —
   mesma matemática de suavização (lerp por EASE_FACTOR) do motor
   original, agora aplicada sobre fotografia real em vez de cena
   procedural.
------------------------------------------------------------------- */

const EASE_FACTOR = 0.07;

const HERO_IMG = "/images/observador-do-ceu.jpg";

export default function Hero() {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = imgRef.current;
    const overlay = overlayRef.current;
    const progressBar = progressBarRef.current;
    const loader = loaderRef.current;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (a, b) => a + Math.random() * (b - a);

    let targetProgress = 0;
    let easedProgress = 0;
    let raf;
    let lastTs = performance.now();

    const RAIN_MAX = 110;
    const rain = Array.from({ length: RAIN_MAX }, () => ({
      x: Math.random(),
      y: Math.random(),
      len: rand(0.014, 0.03),
      speed: rand(0.55, 1.05),
    }));

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function progress() {
      const rect = hero.getBoundingClientRect();
      const total = hero.offsetHeight - window.innerHeight;
      if (total <= 0) return 0;
      return clamp(-rect.top / total, 0, 1);
    }

    function onScroll() {
      targetProgress = progress();
      if (progressBar) progressBar.style.width = (targetProgress * 100).toFixed(2) + "%";
    }

    function drawRain(w, h, p, dt) {
      const intensity = clamp((p - 0.12) / 0.75, 0, 1);
      if (intensity <= 0) return;
      const activeCount = Math.round(RAIN_MAX * intensity);
      ctx.strokeStyle = `rgba(250,245,232,${0.2 + intensity * 0.4})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < activeCount; i++) {
        const d = rain[i];
        d.y += d.speed * dt * 0.00065;
        if (d.y > 1.05) {
          d.y = -0.05;
          d.x = Math.random();
        }
        const x = d.x * w;
        const y = d.y * h;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - w * 0.006, y + d.len * h);
        ctx.stroke();
      }
    }

    function render(ts) {
      const dt = ts - lastTs;
      lastTs = ts;

      easedProgress += (targetProgress - easedProgress) * EASE_FACTOR;
      if (Math.abs(targetProgress - easedProgress) < 0.0008) easedProgress = targetProgress;

      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const p = easedProgress;

      ctx.clearRect(0, 0, w, h);
      drawRain(w, h, p, dt);

      if (img) img.style.transform = `scale(${1.05 + p * 0.09}) translateY(${p * -26}px)`;
      if (overlay) overlay.style.opacity = String(0.68 + p * 0.24);

      raf = requestAnimationFrame(render);
    }

    sizeCanvas();
    onScroll();
    if (loader) requestAnimationFrame(() => loader.classList.add("is-done"));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", sizeCanvas);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", sizeCanvas);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="top" className="scroll-hero" ref={heroRef}>
      <div className="scroll-hero__sticky">
        <div className="hero-stage" ref={stageRef}>
          <img
            className="hero-photo"
            src={HERO_IMG}
            alt="Observador do sertão com os braços erguidos, lendo as nuvens no céu"
            ref={imgRef}
            loading="eager"
          />
          <div className="hero-overlay" ref={overlayRef} />
          <canvas className="hero-canvas" ref={canvasRef} />
        </div>

        <div className="hero-content">
          <span className="eyebrow eyebrow--light">Profetas da Chuva · Quixadá, Ceará</span>
          <h1 className="hero-title">
            A natureza fala.
            <br />
            Os observadores interpretam.
          </h1>
          <p className="hero-sub">
            Conectando gerações através da sabedoria ancestral do sertão cearense: um arquivo
            vivo de quem lê o céu, a terra e os bichos para saber quando a chuva vem.
            {/* TODO: substituir por estrofe verificada de Patativa do Assaré
                ou Luiz Gonzaga, com a devida atribuição de autoria, se desejado. */}
          </p>

          <div className="hero-actions">
            <MagneticButton as="a" href="#memorial" variant="accent" size="lg">
              Explorar observações →
            </MagneticButton>
            <MagneticButton as="a" href="#calendario" variant="ghost-light" size="lg">
              Ver o Encontro de Janeiro
            </MagneticButton>
          </div>
        </div>

        <div className="hero-scrollcue">
          <span>role para sentir a chuva chegar</span>
          <i />
        </div>

        <div className="hero-loader" ref={loaderRef}>
          <span className="hero-loader-bar" />
        </div>
        <div className="scroll-progress">
          <span className="scroll-progress-bar" ref={progressBarRef} />
        </div>
      </div>
    </section>
  );
}

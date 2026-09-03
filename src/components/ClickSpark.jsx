import { useEffect, useRef } from "react";

const isTouch = () => matchMedia("(hover: none)").matches;

export default function ClickSpark() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isTouch() || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#d99a3d";
    const sparks = [];
    let raf;

    function resize() {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const SPARK_COUNT = 5, SPARK_RADIUS = 14, SPARK_SIZE = 6, DURATION = 280;

    function onClick(e) {
      const now = performance.now();
      for (let i = 0; i < SPARK_COUNT; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, angle: (Math.PI * 2 * i) / SPARK_COUNT, start: now });
      }
    }
    window.addEventListener("click", onClick);

    const easeOut = (t) => t * (2 - t);

    function draw(ts) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        const elapsed = ts - s.start;
        if (elapsed >= DURATION) {
          sparks.splice(i, 1);
          continue;
        }
        const p = elapsed / DURATION;
        const eased = easeOut(p);
        const dist = eased * SPARK_RADIUS;
        const len = SPARK_SIZE * (1 - eased);
        const x1 = s.x + dist * Math.cos(s.angle);
        const y1 = s.y + dist * Math.sin(s.angle);
        const x2 = s.x + (dist + len) * Math.cos(s.angle);
        const y2 = s.y + (dist + len) * Math.sin(s.angle);
        ctx.globalAlpha = 1 - p;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas id="spark-canvas" ref={canvasRef} />;
}

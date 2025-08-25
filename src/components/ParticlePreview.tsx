import React, { useRef, useEffect } from "react";

type ParticleConfig = {
  emitter?: { x?: number; y?: number; spread?: number; rate?: number };
  particle?: { size?: number; life?: number; color?: string; gravity?: number; drift?: number };
};

export default function ParticlePreview({ config }: { config: ParticleConfig }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = canvas.clientWidth || 300);
    let h = (canvas.height = canvas.clientHeight || 200);

    const emitter = {
      x: config.emitter?.x ?? w / 2,
      y: config.emitter?.y ?? h / 2,
      spread: config.emitter?.spread ?? 50,
      rate: config.emitter?.rate ?? 10,
    };
    const pCfg = {
      size: config.particle?.size ?? 6,
      life: config.particle?.life ?? 120,
      color: config.particle?.color ?? "#fff",
      gravity: config.particle?.gravity ?? 0.02,
      drift: config.particle?.drift ?? 0.5,
    };

    type P = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; color: string };
    const particles: P[] = [];

    let raf = 0;
    const spawn = () => {
      for (let i = 0; i < emitter.rate; i++) {
        const vx = (Math.random() - 0.5) * 2 * pCfg.drift;
        const vy = -Math.random() * 1.5;
        particles.push({
          x: emitter.x + (Math.random() - 0.5) * emitter.spread,
          y: emitter.y + (Math.random() - 0.5) * emitter.spread * 0.2,
          vx,
          vy,
          age: 0,
          life: pCfg.life + Math.floor(Math.random() * 30),
          size: pCfg.size * (0.7 + Math.random() * 0.8),
          color: pCfg.color,
        });
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, w, h);
      spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += pCfg.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.age++;
        const t = p.age / p.life;
        ctx.globalAlpha = Math.max(0, 1 - t);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.6), 0, Math.PI * 2);
        ctx.fill();
        if (p.age >= p.life) particles.splice(i, 1);
      }
    };

    loop();
    const onResize = () => {
      w = canvas.width = canvas.clientWidth;
      h = canvas.height = canvas.clientHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [config]);

  return <canvas ref={canvasRef} className="w-full h-48 rounded bg-black/5" />;
}

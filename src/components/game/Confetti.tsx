import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'square' | 'circle' | 'star';
  opacity: number;
  decay: number;
}

interface ConfettiProps {
  active: boolean;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#ff00ff', // neon pink
  '#00d4ff', // neon blue
  '#ffff00', // neon yellow
  '#00ff88', // neon green
  '#ff6600', // neon orange
  '#aa00ff', // neon purple
];

export function Confetti({ 
  active, 
  intensity = 'medium', 
  duration = 4000,
  colors = DEFAULT_COLORS 
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [isVisible, setIsVisible] = useState(false);

  const particleCount = intensity === 'low' ? 50 : intensity === 'medium' ? 100 : 200;

  useEffect(() => {
    if (!active) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Create particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 8 + Math.random() * 12;
      
      particlesRef.current.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height / 2,
        vx: Math.cos(angle) * velocity * (Math.random() * 0.5 + 0.5),
        vy: Math.sin(angle) * velocity - 5 - Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        shape: ['square', 'circle', 'star'][Math.floor(Math.random() * 3)] as Particle['shape'],
        opacity: 1,
        decay: 0.008 + Math.random() * 0.008,
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;

      particlesRef.current.forEach(particle => {
        if (particle.opacity <= 0) return;
        activeParticles++;

        // Update physics
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.3; // gravity
        particle.vx *= 0.99; // air resistance
        particle.rotation += particle.rotationSpeed;
        particle.opacity -= particle.decay;

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = Math.max(0, particle.opacity);
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 10;

        const halfSize = particle.size / 2;

        switch (particle.shape) {
          case 'square':
            ctx.fillRect(-halfSize, -halfSize, particle.size, particle.size);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'star':
            drawStar(ctx, 0, 0, 5, halfSize, halfSize / 2);
            break;
        }

        ctx.restore();
      });

      if (activeParticles > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsVisible(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Auto-hide after duration
    const timeout = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsVisible(false);
    }, duration);

    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearTimeout(timeout);
    };
  }, [active, particleCount, colors, duration]);

  if (!isVisible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

// Sparkle effect for stars
interface SparkleProps {
  active: boolean;
}

export function Sparkles({ active }: SparkleProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (!active) {
      setSparkles([]);
      return;
    }

    const newSparkles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));

    setSparkles(newSparkles);

    const timeout = setTimeout(() => {
      setSparkles([]);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [active]);

  if (!active || sparkles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99] overflow-hidden">
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute animate-ping"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: '1s',
          }}
        >
          <span className="text-2xl">✨</span>
        </div>
      ))}
    </div>
  );
}

// Floating particles background effect
interface FloatingParticlesProps {
  count?: number;
}

export function FloatingParticles({ count = 15 }: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 8,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-primary/50 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Star burst effect for 3-star wins
interface StarBurstProps {
  active: boolean;
  starCount: number;
}

export function StarBurst({ active, starCount }: StarBurstProps) {
  const [bursts, setBursts] = useState<Array<{ id: number; angle: number; distance: number }>>([]);

  useEffect(() => {
    if (!active || starCount < 3) {
      setBursts([]);
      return;
    }

    const newBursts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i * 30) * (Math.PI / 180),
      distance: 80 + Math.random() * 40,
    }));

    setBursts(newBursts);

    const timeout = setTimeout(() => {
      setBursts([]);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [active, starCount]);

  if (!active || starCount < 3 || bursts.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {bursts.map((burst, i) => (
        <div
          key={burst.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: 'star-burst-fly 1s ease-out forwards',
            animationDelay: `${i * 0.05}s`,
            '--angle': `${burst.angle}rad`,
            '--distance': `${burst.distance}px`,
          } as React.CSSProperties}
        >
          <span className="text-xl text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">⭐</span>
        </div>
      ))}
    </div>
  );
}

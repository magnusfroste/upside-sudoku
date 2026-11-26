import { useRef, useState } from 'react';
import { Share2, Download, Copy, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareResultsProps {
  stars: number;
  timeSeconds: number;
  dailyStreak: number;
  date: string;
  onClose: () => void;
}

export function ShareResults({
  stars,
  timeSeconds,
  dailyStreak,
  date,
  onClose,
}: ShareResultsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generateImage = async (): Promise<string | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#1a0a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    // Add decorative grid pattern
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 600; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 400);
      ctx.stroke();
    }
    for (let i = 0; i < 400; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(600, i);
      ctx.stroke();
    }

    // Border
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 580, 380);
    
    // Inner glow border
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 560, 360);

    // Title
    ctx.font = 'bold 32px "Press Start 2P", monospace';
    ctx.fillStyle = '#ff00ff';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.fillText('UPSIDE SUDOKU', 300, 70);

    // Subtitle
    ctx.font = '16px monospace';
    ctx.fillStyle = '#00ffff';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.fillText('Daglig Utmaning', 300, 100);

    // Date
    ctx.font = '14px monospace';
    ctx.fillStyle = '#888888';
    ctx.shadowBlur = 0;
    ctx.fillText(date, 300, 130);

    // Stars
    ctx.font = '48px sans-serif';
    ctx.shadowBlur = 0;
    const starY = 180;
    const starSpacing = 60;
    const starStartX = 300 - starSpacing;
    
    for (let i = 0; i < 3; i++) {
      if (i < stars) {
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;
      } else {
        ctx.fillStyle = '#444444';
        ctx.shadowBlur = 0;
      }
      ctx.fillText('★', starStartX + (i * starSpacing), starY);
    }

    ctx.shadowBlur = 0;

    // Stats box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(100, 210, 400, 100);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 210, 400, 100);

    // Time
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('⏱️ Tid', 200, 250);
    ctx.font = '28px monospace';
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.fillText(formatTime(timeSeconds), 200, 290);

    // Streak
    ctx.shadowBlur = 0;
    ctx.font = 'bold 24px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('🔥 Streak', 400, 250);
    ctx.font = '28px monospace';
    ctx.fillStyle = '#ff6600';
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 10;
    ctx.fillText(`${dailyStreak} dagar`, 400, 290);

    // Footer
    ctx.shadowBlur = 0;
    ctx.font = '12px monospace';
    ctx.fillStyle = '#666666';
    ctx.fillText('Spela på sudoku.skolappar.org', 300, 370);

    return canvas.toDataURL('image/png');
  };

  const handleShare = async () => {
    setGenerating(true);
    const imageData = await generateImage();
    setGenerating(false);

    if (!imageData) return;

    // Try native share API first
    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(imageData)).blob();
        const file = new File([blob], 'sudoku-resultat.png', { type: 'image/png' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Upside Sudoku - Daglig Utmaning',
            text: `Jag klarade dagens Sudoku på ${formatTime(timeSeconds)} med ${stars} stjärnor! 🌟`,
            files: [file],
          });
          return;
        }
      } catch (err) {
        console.log('Native share failed, falling back to download');
      }
    }

    // Fallback: download the image
    handleDownload();
  };

  const handleDownload = async () => {
    setGenerating(true);
    const imageData = await generateImage();
    setGenerating(false);

    if (!imageData) return;

    const link = document.createElement('a');
    link.download = `sudoku-resultat-${date}.png`;
    link.href = imageData;
    link.click();
  };

  const handleCopyText = () => {
    const starsEmoji = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    const text = `Upside Sudoku - Daglig Utmaning 🎮\n${date}\n\n${starsEmoji}\n⏱️ Tid: ${formatTime(timeSeconds)}\n🔥 Streak: ${dailyStreak} dagar\n\nSpela på sudoku.skolappar.org`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-[60] p-4">
      <div className="w-full max-w-md bg-card border-2 border-primary rounded-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-pixel text-lg text-primary mb-4 text-center">
          DELA RESULTAT
        </h3>

        {/* Preview */}
        <div className="mb-4 p-4 bg-background/50 rounded-lg border border-border">
          <div className="text-center space-y-2">
            <p className="font-retro text-sm text-muted-foreground">{date}</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((num) => (
                <span
                  key={num}
                  className={cn(
                    'text-2xl',
                    num <= stars ? 'text-accent' : 'text-muted-foreground/30'
                  )}
                >
                  ★
                </span>
              ))}
            </div>
            <div className="flex justify-center gap-6 font-retro text-sm">
              <span className="text-secondary">⏱️ {formatTime(timeSeconds)}</span>
              <span className="text-neon-red">🔥 {dailyStreak} dagar</span>
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            disabled={generating}
            className="neon-button neon-button-pink flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>{generating ? 'Skapar bild...' : 'Dela som bild'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={generating}
            className="neon-button neon-button-blue flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Ladda ner bild</span>
          </button>

          <button
            onClick={handleCopyText}
            className="neon-button neon-button-green flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Kopierat!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Kopiera som text</span>
              </>
            )}
          </button>
        </div>

        {/* Hidden canvas for image generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

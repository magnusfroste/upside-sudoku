import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb, 
  Star, 
  Grid3X3, 
  MousePointer, 
  Trophy,
  Sparkles,
  Play
} from 'lucide-react';
import { SYMBOLS_4X4 } from '@/lib/gameData';

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface TutorialStep {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  highlight?: string;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: TutorialStep[] = [
    {
      title: "Välkommen!",
      icon: <Sparkles className="w-12 h-12 text-accent" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Välkommen till <span className="text-primary font-pixel">Upside Down Sudoku</span>!
          </p>
          <p>
            Du ska hjälpa till att lösa mystiska pussel och rädda Hawkins från mörka krafter.
          </p>
          <p className="text-muted-foreground">
            Låt oss lära oss hur man spelar!
          </p>
        </div>
      ),
    },
    {
      title: "Vad är Sudoku?",
      icon: <Grid3X3 className="w-12 h-12 text-secondary" />,
      content: (
        <div className="space-y-4">
          <p>
            Sudoku är ett <span className="text-secondary">pusselspel</span> där du fyller i rutor med symboler eller siffror.
          </p>
          <div className="flex justify-center gap-3 my-4">
            {SYMBOLS_4X4.map((symbol, i) => (
              <span key={i} className="text-3xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {symbol}
              </span>
            ))}
          </div>
          <p>
            Varje symbol får bara finnas <span className="text-accent">en gång</span> i varje rad, kolumn och ruta!
          </p>
        </div>
      ),
    },
    {
      title: "Spelplanen",
      icon: <Grid3X3 className="w-12 h-12 text-neon-blue" />,
      content: (
        <div className="space-y-4">
          <p>
            Spelplanen är uppdelad i <span className="text-neon-blue">rader</span>, <span className="text-neon-pink">kolumner</span> och <span className="text-neon-purple">rutor</span>.
          </p>
          {/* Mini grid illustration */}
          <div className="flex justify-center my-4">
            <div className="grid grid-cols-4 gap-0.5 p-2 bg-card/50 border border-border rounded-lg">
              {Array.from({ length: 16 }, (_, i) => {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const isHighlightedRow = row === 1;
                const isHighlightedCol = col === 2;
                const isBox = row < 2 && col >= 2;
                
                return (
                  <div
                    key={i}
                    className={cn(
                      'w-8 h-8 flex items-center justify-center border border-border/50 text-sm',
                      isHighlightedRow && 'bg-neon-blue/20',
                      isHighlightedCol && 'bg-neon-pink/20',
                      isBox && 'bg-neon-purple/20',
                      isHighlightedRow && isHighlightedCol && 'bg-accent/30',
                    )}
                  >
                    {i === 5 && '🚲'}
                    {i === 6 && '?'}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Blå = rad, Rosa = kolumn, Lila = ruta
          </p>
        </div>
      ),
    },
    {
      title: "Välj en ruta",
      icon: <MousePointer className="w-12 h-12 text-primary" />,
      content: (
        <div className="space-y-4">
          <p>
            Tryck på en <span className="text-primary">tom ruta</span> för att välja den.
          </p>
          <div className="flex justify-center my-4">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-primary bg-primary/20 rounded-lg flex items-center justify-center box-glow-pink animate-pulse">
                <span className="text-2xl opacity-50">?</span>
              </div>
              <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce">
                👆
              </div>
            </div>
          </div>
          <p>
            Den valda rutan <span className="text-primary">lyser</span> så du vet vilken du jobbar med!
          </p>
        </div>
      ),
    },
    {
      title: "Fyll i symbolen",
      icon: <Sparkles className="w-12 h-12 text-neon-green" />,
      content: (
        <div className="space-y-4">
          <p>
            Tryck sedan på rätt <span className="text-secondary">symbol</span> eller <span className="text-secondary">siffra</span> nedanför.
          </p>
          <div className="flex justify-center gap-2 my-4">
            {SYMBOLS_4X4.map((symbol, i) => (
              <div
                key={i}
                className={cn(
                  'w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl',
                  i === 1 ? 'border-secondary bg-secondary/20 box-glow-blue scale-110' : 'border-border/50'
                )}
              >
                {symbol}
              </div>
            ))}
          </div>
          <p>
            Om du gissar <span className="text-neon-green">rätt</span> fyller rutan i! 
            Gissar du <span className="text-destructive">fel</span> skakar rutan.
          </p>
        </div>
      ),
    },
    {
      title: "Elevens Power",
      icon: <Lightbulb className="w-12 h-12 text-neon-purple" />,
      content: (
        <div className="space-y-4">
          <p>
            Fastnat? Använd <span className="text-neon-purple">Elevens Power</span>!
          </p>
          <div className="flex justify-center my-4">
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-neon-purple/50 rounded-lg bg-neon-purple/10">
              <Lightbulb className="w-6 h-6 text-neon-purple animate-pulse" />
              <span className="font-retro text-neon-purple">Elevens Power</span>
              <span className="bg-neon-purple/20 px-2 py-0.5 rounded text-neon-purple">3</span>
            </div>
          </div>
          <p>
            Du har <span className="text-neon-purple">3 hints</span> per pussel. 
            En slumpmässig ruta fylls i automatiskt!
          </p>
        </div>
      ),
    },
    {
      title: "Samla stjärnor!",
      icon: <Star className="w-12 h-12 text-accent fill-accent" />,
      content: (
        <div className="space-y-4">
          <p>
            Lös pussel och samla <span className="text-accent">stjärnor</span>!
          </p>
          <div className="flex justify-center gap-2 my-4">
            {[1, 2, 3].map((i) => (
              <Star
                key={i}
                className="w-10 h-10 text-accent fill-accent animate-star-burst"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <div className="text-sm space-y-1">
            <p><span className="text-accent">⭐</span> = Klara pusslet</p>
            <p><span className="text-accent">⭐⭐</span> = Klara snabbt ELLER utan fel</p>
            <p><span className="text-accent">⭐⭐⭐</span> = Klara snabbt OCH utan fel</p>
          </div>
        </div>
      ),
    },
    {
      title: "Lås upp världar!",
      icon: <Trophy className="w-12 h-12 text-neon-yellow" />,
      content: (
        <div className="space-y-4">
          <p>
            Med tillräckligt många stjärnor låser du upp <span className="text-neon-yellow">nya världar</span>!
          </p>
          <div className="flex justify-center gap-4 my-4">
            <div className="text-center">
              <span className="text-3xl">🔬</span>
              <p className="text-xs text-muted-foreground">Hawkins Lab</p>
            </div>
            <div className="text-center">
              <span className="text-3xl">🕹️</span>
              <p className="text-xs text-muted-foreground">The Arcade</p>
            </div>
            <div className="text-center">
              <span className="text-3xl">🛒</span>
              <p className="text-xs text-muted-foreground">Starcourt</p>
            </div>
            <div className="text-center">
              <span className="text-3xl">🌀</span>
              <p className="text-xs text-muted-foreground">Upside Down</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            Varje värld har nya utmaningar och svårare pussel!
          </p>
        </div>
      ),
    },
    {
      title: "Redo att spela!",
      icon: <Play className="w-12 h-12 text-neon-green" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Nu vet du allt du behöver! 🎮
          </p>
          <div className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-lg">
            <p className="text-neon-green font-retro">
              Tips: Glöm inte den <span className="font-bold">dagliga utmaningen</span> för extra bonuspoäng!
            </p>
          </div>
          <p>
            Lycka till med att rädda Hawkins! ⚡
          </p>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                i === currentStep
                  ? 'bg-primary w-6'
                  : i < currentStep
                  ? 'bg-primary/50'
                  : 'bg-muted'
              )}
            />
          ))}
        </div>

        {/* Content card */}
        <div className="bg-card border-2 border-primary/50 rounded-xl p-6 animate-slide-up">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="animate-float">
              {currentStepData.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="font-pixel text-lg text-primary text-center text-glow-pink mb-4">
            {currentStepData.title}
          </h2>

          {/* Content */}
          <div className="font-retro text-foreground text-center min-h-[200px] flex items-center justify-center">
            <div>{currentStepData.content}</div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={cn(
                'flex items-center gap-1 px-4 py-2 rounded-lg font-retro transition-all',
                isFirstStep
                  ? 'opacity-0 pointer-events-none'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Tillbaka
            </button>

            <button
              onClick={onSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-retro"
            >
              Hoppa över
            </button>

            <button
              onClick={handleNext}
              className={cn(
                'flex items-center gap-1 px-4 py-2 rounded-lg font-retro transition-all',
                isLastStep
                  ? 'bg-neon-green text-background hover:bg-neon-green/80'
                  : 'text-primary hover:text-primary/80'
              )}
            >
              {isLastStep ? 'Starta!' : 'Nästa'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step counter */}
        <p className="text-center text-muted-foreground font-retro text-sm mt-4">
          {currentStep + 1} av {steps.length}
        </p>
      </div>
    </div>
  );
}


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Lightbulb } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function FloatingFeedbackButton() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  return (
    <Button
      onClick={() => navigate('/create')}
      size="icon"
      className={cn(
        "fixed bottom-4 right-4 z-50 h-[3.85rem] w-[3.85rem] sm:h-[4.24rem] sm:w-[4.24rem] rounded-full shadow-lg",
        "bg-gradient-yellow hover:shadow-glow text-neutral-900",
        "flex items-center justify-center transition-all duration-300",
        "animate-fade-in",
        "safe-area-inset"
      )}
      aria-label="Create new feedback"
    >
      <Lightbulb className="h-[1.65rem] w-[1.65rem] sm:h-[1.8rem] sm:w-[1.8rem]" />
    </Button>
  );
}

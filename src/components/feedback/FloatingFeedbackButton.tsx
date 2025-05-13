
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
        "fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg",
        "bg-gradient-yellow hover:shadow-glow text-neutral-900",
        "flex items-center justify-center transition-all duration-300",
        "animate-fade-in"
      )}
      aria-label="Create new feedback"
    >
      <Lightbulb className="h-6 w-6" />
    </Button>
  );
}

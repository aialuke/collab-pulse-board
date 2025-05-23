
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusSquare } from '@/components/icons';

export function NewFeedbackButton() {
  const navigate = useNavigate();
  
  return (
    <Button 
      onClick={() => navigate('/create')}
      className="bg-gradient-yellow hover:shadow-glow text-neutral-900 min-h-12"
    >
      <PlusSquare className="mr-2 h-5 w-5" />
      New Feedback
    </Button>
  );
}

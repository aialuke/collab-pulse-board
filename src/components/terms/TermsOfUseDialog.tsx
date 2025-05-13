
import React, { useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TermsCheckboxItem } from './TermsCheckboxItem';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const TERMS = [{
  id: "personal-info",
  title: "Personal Information",
  content: "Posts and any images uploaded should never contain any personal information such as customer details, receipt numbers, phone numbers etc."
}, {
  id: "feedback",
  title: "Feedback",
  content: "All feedback should be constructive and general in nature - this is not a platform for calling anyone out individually."
}, {
  id: "conduct",
  title: "Conduct",
  content: "This is a tool intended for work purposes and the same expectations of adhering to the Group Code of Conduct apply."
}];

type TermsOfUseDialogProps = {
  open: boolean;
};

export function TermsOfUseDialog({
  open
}: TermsOfUseDialogProps) {
  const {
    acceptTerms
  } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkedTerms, setCheckedTerms] = useState<Record<string, boolean>>({
    "personal-info": false,
    "feedback": false,
    "conduct": false
  });
  
  const allTermsChecked = Object.values(checkedTerms).every(value => value === true);
  
  const handleCheck = (id: string, checked: boolean) => {
    setCheckedTerms(prev => ({
      ...prev,
      [id]: checked
    }));
  };
  
  const handleAccept = async () => {
    if (!allTermsChecked) return;
    setIsSubmitting(true);
    try {
      await acceptTerms(true);
      toast({
        title: "Terms Accepted",
        description: "Thank you for accepting our terms of use."
      });
    } catch (error) {
      console.error("Failed to accept terms:", error);
      toast({
        title: "Error",
        description: "Could not accept terms. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-center text-teal-700">
            Terms of Use
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="my-3 space-y-3">
          <div className="space-y-2">
            {TERMS.map(term => (
              <TermsCheckboxItem 
                key={term.id} 
                id={term.id} 
                title={term.title} 
                content={term.content} 
                checked={checkedTerms[term.id]} 
                onCheckedChange={checked => handleCheck(term.id, checked)} 
              />
            ))}
          </div>
        </div>
        
        <AlertDialogFooter className="mt-3 flex justify-center">
          <Button 
            onClick={handleAccept} 
            disabled={!allTermsChecked || isSubmitting} 
            className="bg-[#fcef50] px-8 py-2"
          >
            {isSubmitting ? "Accepting..." : "I Accept"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

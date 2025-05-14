
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, acceptTerms } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return <div className="text-body">Loading profile...</div>;
  }

  const isManager = user.role === 'manager' || user.role === 'admin';
  
  const handleReacceptTerms = () => {
    // This will trigger the terms dialog to show again through the ProtectedRoute
    acceptTerms(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')} 
          className="hover:bg-yellow-500/10 -ml-3 mt-2"
          aria-label="Go back to home page"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="heading-2 text-center">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="space-y-1">
              <h3 className="heading-3">{user.name}</h3>
              <p className="subheading text-muted-foreground">{user.email}</p>
              <p className={`text-body-small inline-block px-2 py-0.5 rounded-full mt-1 ${
                isManager ? 'bg-royal-blue-500/20 text-royal-blue-700' : 'bg-teal-500/20 text-teal-700'
              }`}>
                {user.role === 'admin' ? 'Administrator' : user.role === 'manager' ? 'Manager' : 'Team Member'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border-neutral-200">
        <CardHeader>
          <CardTitle className="heading-2 text-center">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          {user.hasAcceptedTerms ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-500 h-5 w-5" />
                <div>
                  <p className="subheading font-medium">You have accepted our Terms of Use</p>
                  {user.termsAcceptedAt && (
                    <p className="text-body-small text-muted-foreground">
                      Accepted on {format(new Date(user.termsAcceptedAt), 'MMMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleReacceptTerms}
                className="mt-2"
              >
                Review Terms Again
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500 h-5 w-5" />
              <p className="subheading font-medium">You need to accept our Terms of Use</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

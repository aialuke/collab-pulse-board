
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, acceptTerms } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return <div>Loading profile...</div>;
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
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative">
              <Avatar className={`h-24 w-24 ${isManager ? 'ring-2 ring-royal-blue-500/30' : 'ring-2 ring-yellow-500/30'}`}>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className={`text-lg ${isManager ? 'bg-royal-blue-100 text-royal-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-1 flex-1">
              <h3 className="text-xl font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className={`text-xs inline-block px-2 py-0.5 rounded-full mt-1 ${
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
          <CardTitle>Terms of Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {user.hasAcceptedTerms ? (
              <>
                <CheckCircle className="text-green-500 h-5 w-5" />
                <div>
                  <p className="font-medium">You have accepted our Terms of Use</p>
                  {user.termsAcceptedAt && (
                    <p className="text-sm text-muted-foreground">
                      Accepted on {format(new Date(user.termsAcceptedAt), 'MMMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="text-red-500 h-5 w-5" />
                <p className="font-medium">You need to accept our Terms of Use</p>
              </>
            )}
          </div>
          
          {user.hasAcceptedTerms && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReacceptTerms}
              className="mt-2"
            >
              Review Terms Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

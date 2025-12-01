
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';

interface AdminProfileSetupProps {
  message: string;
  onSetupAdmin: () => void;
  isLoading: boolean;
}

const AdminProfileSetup: React.FC<AdminProfileSetupProps> = ({
  message,
  onSetupAdmin,
  isLoading
}) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-blue-800">Setup Admin Profile</CardTitle>
        </div>
        <CardDescription className="text-blue-700">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onSetupAdmin}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting up...
            </>
          ) : (
            'Setup Admin Profile'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminProfileSetup;

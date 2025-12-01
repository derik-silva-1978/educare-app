
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert, Shield, AlertTriangle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminProfileSetup from '@/components/admin/AdminProfileSetup';
import { safeTableQuery } from '@/utils/supabase-rpc-utils';
import { checkAdminAuthorization } from '@/utils/admin-authorization';

const AdminSettings = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{
    hasProfile: boolean;
    isAdmin: boolean;
    isAdminAuthorized: boolean;
    isChecking: boolean;
  }>({
    hasProfile: false,
    isAdmin: false,
    isAdminAuthorized: false,
    isChecking: true
  });

  // Check if user has an admin profile in educare_profiles table
  useEffect(() => {
    const checkAdminProfile = async () => {
      if (!user) return;
      
      try {
        setProfileStatus(prev => ({ ...prev, isChecking: true }));
        
        // Check if user exists in educare_profiles
        const { data, error } = await supabase
          .from('educare_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          throw error;
        }
        
        // Check if user is authorized as admin
        const isAdminAuthorized = await checkAdminAuthorization(user.id);
          
        setProfileStatus({
          hasProfile: !!data,
          isAdmin: data?.role === 'admin',
          isAdminAuthorized,
          isChecking: false
        });
        
      } catch (error) {
        console.error('Error checking admin profile:', error);
        setProfileStatus({
          hasProfile: false,
          isAdmin: false,
          isAdminAuthorized: false,
          isChecking: false
        });
      }
    };
    
    checkAdminProfile();
  }, [user]);

  const makeAdmin = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // First check if user is authorized
      const isAuthorized = await checkAdminAuthorization(user.id);
        
      if (!isAuthorized) {
        throw new Error('You are not authorized to become an admin. Contact an existing admin for authorization.');
      }
      
      // Update user metadata to include admin role
      const { error } = await supabase.auth.updateUser({
        data: {
          role: 'admin'
        }
      });

      if (error) throw error;
      
      // Update local user state
      await updateProfile({ role: 'admin' });
      
      toast({
        title: "Admin rights granted",
        description: "You now have admin privileges. You may need to log out and back in for all changes to take effect.",
      });

      // Refresh the page to ensure the changes take effect
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error setting admin role:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update role to admin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupAdminProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Check if user is authorized as admin
      const isAuthorized = await checkAdminAuthorization(user.id);
        
      if (!isAuthorized) {
        throw new Error('You are not authorized to create an admin profile. Contact an existing admin for authorization.');
      }
      
      // First ensure user has admin role in metadata
      if (user.role !== 'admin') {
        await supabase.auth.updateUser({
          data: { role: 'admin' }
        });
        
        await updateProfile({ role: 'admin' });
      }
      
      // Create/update profile in educare_profiles table
      const { error } = await supabase
        .from('educare_profiles')
        .upsert({
          id: user.id,
          name: user.name || 'Admin User',
          email: user.email,
          role: 'admin',
        }, { onConflict: 'id' });
      
      if (error) throw error;
      
      toast({
        title: "Admin profile created",
        description: "Your admin profile has been successfully created in the database.",
      });
      
      // Update local state
      setProfileStatus({
        hasProfile: true,
        isAdmin: true,
        isAdminAuthorized: true,
        isChecking: false
      });
      
    } catch (error: any) {
      console.error('Error setting up admin profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create admin profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="bg-amber-50 border-b">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-amber-600" />
            <CardTitle>Admin Settings</CardTitle>
          </div>
          <CardDescription>
            Update your account to have administrator privileges
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-md border">
              <h3 className="font-medium mb-2">Current Role</h3>
              <div className="inline-block px-2 py-1 rounded bg-slate-200 text-sm">
                {user?.role || 'Unknown'}
              </div>
            </div>
            
            {profileStatus.isChecking ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                <span className="ml-2">Checking admin profile...</span>
              </div>
            ) : !profileStatus.isAdminAuthorized ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Not Authorized</AlertTitle>
                <AlertDescription>
                  <p className="mb-2">
                    You are not authorized to become an admin. Contact an existing admin to be added to the admin authorization list.
                  </p>
                </AlertDescription>
              </Alert>
            ) : profileStatus.hasProfile ? (
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h3 className="font-medium text-green-800 mb-2">Admin Profile Status</h3>
                <p className="text-sm text-green-700 mb-4">
                  You have a valid admin profile in the database.
                </p>
              </div>
            ) : (
              <AdminProfileSetup 
                message="You are authorized as an admin but need to create an admin profile in the database to use admin features like Quiz Admin."
                onSetupAdmin={setupAdminProfile}
                isLoading={isLoading}
              />
            )}
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h3 className="font-medium text-amber-800 mb-2">Admin Access</h3>
              <p className="text-sm text-amber-700 mb-4">
                Granting admin privileges will give you full access to all administrative features including the Quiz Admin page.
              </p>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle>Security Information</AlertTitle>
              <AlertDescription className="text-blue-700">
                Admin access is protected by an authorization system. Only users who have been authorized by existing admins can activate admin privileges.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end border-t bg-slate-50 py-4">
          <Button 
            variant="default" 
            onClick={makeAdmin}
            disabled={isLoading || user?.role === 'admin' || !profileStatus.isAdminAuthorized}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : user?.role === 'admin' ? (
              'Already Admin'
            ) : !profileStatus.isAdminAuthorized ? (
              'Not Authorized'
            ) : (
              'Make Me Admin'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSettings;

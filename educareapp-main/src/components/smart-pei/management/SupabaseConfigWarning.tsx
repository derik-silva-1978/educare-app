
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { isSupabaseConfigured } from '@/services/supabase';
import { config } from '@/config/supabase-config';

export const SupabaseConfigWarning: React.FC = () => {
  // If Supabase is configured, show success message or return null
  if (isSupabaseConfigured()) {
    // If we want to show success message
    return (
      <Alert variant="default" className="mb-4 bg-green-50 text-green-800 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Supabase is connected</AlertTitle>
        <AlertDescription>
          <p className="text-sm">
            Your Supabase connection is configured and working properly.
          </p>
        </AlertDescription>
      </Alert>
    );
    
    // Or if we prefer to show nothing when properly configured:
    // return null;
  }

  return (
    <Alert variant="warning" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Supabase Configuration Missing</AlertTitle>
      <AlertDescription>
        <p className="mb-2">
          Your Supabase environment variables are not configured. The migration tool and other Supabase features will not work properly.
        </p>
        <p className="text-sm">
          Current configuration:
        </p>
        <ul className="list-disc pl-5 text-sm mt-2">
          <li>SUPABASE_URL: {config.url.includes('ripfuvuhfbjccuvpdplf.supabase.co') ? 'Using default value' : 'Not configured'}</li>
          <li>SUPABASE_ANON_KEY: {config.anonKey.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9') ? 'Using default value' : 'Not configured'}</li>
        </ul>
        <p className="text-sm mt-2">
          To configure your own Supabase project, you need to set the following environment variables:
        </p>
        <ul className="list-disc pl-5 text-sm mt-2">
          <li>VITE_SUPABASE_URL - Your Supabase project URL</li>
          <li>VITE_SUPABASE_ANON_KEY - Your Supabase anonymous key</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
};

export default SupabaseConfigWarning;

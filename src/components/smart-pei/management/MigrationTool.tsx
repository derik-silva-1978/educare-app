
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, Database, Code } from 'lucide-react';
import { migrateLocalStorageLicenses } from '@/utils/migrateToSupabase';
import { isSupabaseConfigured } from '@/services/supabase';
import SupabaseConfigWarning from './SupabaseConfigWarning';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { storedProcedures } from '@/config/supabase-config';

export const MigrationTool: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    migrated: number;
    errors: number;
  } | null>(null);

  const handleMigration = async () => {
    setIsMigrating(true);
    try {
      const result = await migrateLocalStorageLicenses();
      setMigrationResult(result);
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationResult({
        success: false,
        migrated: 0,
        errors: 1
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Migration Tool
        </CardTitle>
        <CardDescription>
          Transfer license data from localStorage to Supabase
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <SupabaseConfigWarning />
        
        <Alert variant="warning" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Stored Procedures Required</AlertTitle>
          <AlertDescription>
            <p className="text-sm">
              Before using the migration tool, you need to create the required stored procedures in Supabase.
              Open the SQL Editor in Supabase and run the stored procedures shown below.
            </p>
            <Accordion type="single" collapsible className="mt-2">
              <AccordionItem value="procedures">
                <AccordionTrigger className="text-sm">
                  <span className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    View Required SQL Procedures
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
                    <pre>{Object.values(storedProcedures).join('\n\n')}</pre>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">
                    Copy these SQL procedures and run them in the Supabase SQL Editor before attempting migration.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AlertDescription>
        </Alert>
        
        <p className="text-sm text-muted-foreground mb-4">
          This tool will migrate all your license data from browser localStorage to the Supabase database.
          This is a one-time operation that should be performed after setting up Supabase integration.
        </p>
        
        {migrationResult && (
          <Alert variant={migrationResult.success ? "default" : "destructive"} className="mt-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-2">
                {migrationResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>
              <div>
                <AlertTitle>
                  {migrationResult.success ? 'Migration Successful' : 'Migration Incomplete'}
                </AlertTitle>
                <AlertDescription className="mt-1">
                  <p>
                    {migrationResult.migrated} licenses migrated successfully.
                    {migrationResult.errors > 0 && ` ${migrationResult.errors} errors occurred.`}
                  </p>
                  {!migrationResult.success && (
                    <p className="mt-2 text-sm">
                      Check the console for more details about the errors.
                    </p>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleMigration} 
          disabled={isMigrating || (migrationResult?.success === true) || !isSupabaseConfigured()}
          className="w-full"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : migrationResult?.success ? (
            'Migration Complete'
          ) : (
            'Start Migration'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MigrationTool;

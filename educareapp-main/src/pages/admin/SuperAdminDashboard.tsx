
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useCustomAuth as useAuth } from '@/hooks/useCustomAuth';
import { useRoleSystem } from '@/hooks/useRoleSystem';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert,
  Users,
  Settings,
  Database,
  Layers,
  Key,
  BarChart4
} from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { hasRole } = useRoleSystem();
  
  const isSuperAdmin = hasRole('super_admin');
  
  return (
    <>
      <Helmet>
        <title>Super Admin Dashboard</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <ShieldAlert className="h-8 w-8 text-amber-600 mr-3" />
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">
            Welcome to the Super Admin management interface. This dashboard provides access to system-wide
            settings and user management tools.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-t-4 border-t-purple-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">User Management</CardTitle>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <CardDescription>
                Manage user accounts and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Create, edit, or delete users and assign roles. Control who has access to different parts of the system.
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/admin/super-admin/users">
                  Manage Users
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-t-4 border-t-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Roles & Permissions</CardTitle>
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <CardDescription>
                Configure system roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Define what actions different user roles can perform. Create custom roles for specific needs.
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/super-admin/roles">
                  Manage Roles
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-t-4 border-t-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Environments</CardTitle>
                <Layers className="h-5 w-5 text-green-600" />
              </div>
              <CardDescription>
                Manage application environments and access
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Control which roles can access different application environments and features.
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/super-admin/environments">
                  Configure Environments
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-t-4 border-t-amber-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">System Settings</CardTitle>
                <Settings className="h-5 w-5 text-amber-600" />
              </div>
              <CardDescription>
                Configure global system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Manage system-wide configuration, defaults, and feature toggles.
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/super-admin/settings">
                  System Settings
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-t-4 border-t-indigo-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Data Management</CardTitle>
                <Database className="h-5 w-5 text-indigo-600" />
              </div>
              <CardDescription>
                Manage system data and backups
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              View database status, export data, or restore from backups.
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/super-admin/data">
                  Data Tools
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-t-4 border-t-rose-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">System Analytics</CardTitle>
                <BarChart4 className="h-5 w-5 text-rose-600" />
              </div>
              <CardDescription>
                View system-wide analytics and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              Monitor system performance, user activity, and other important metrics.
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/admin/super-admin/analytics">
                  View Analytics
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;


import React from 'react';
import { Placeholder } from '../placeholders/SmartPEIPlaceholders';

export * from "../dashboard/Dashboard";

export const DashboardContent: React.FC<any> = (props) => {
  return <Placeholder title="Dashboard Content" description="This component would display dashboard content." {...props} />;
};

export default DashboardContent;

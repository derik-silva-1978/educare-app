
import React from 'react';
import { Placeholder } from '../placeholders/SmartPEIPlaceholders';

export * from "./EmptyStudentState";

export const EnhancedStudentList: React.FC<any> = (props) => {
  return <Placeholder title="Enhanced Student List" description="This component would display an enhanced student list." {...props} />;
};

export default EnhancedStudentList;

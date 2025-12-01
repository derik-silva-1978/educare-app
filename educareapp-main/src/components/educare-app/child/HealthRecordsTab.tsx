
import React from 'react';
import { HealthRecordsTabSimplified } from './HealthRecordsTabSimplified';

interface HealthRecordsTabProps {
  childId: string;
}

export const HealthRecordsTab: React.FC<HealthRecordsTabProps> = ({ childId }) => {
  return <HealthRecordsTabSimplified childId={childId} />;
};

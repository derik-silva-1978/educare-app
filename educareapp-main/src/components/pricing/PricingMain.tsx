
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PricingHeader from './PricingHeader';
import PricingPlans from './PricingPlans';
import EnterpriseCalculator from './EnterpriseCalculator';
import { calculateEnterpriseCost } from '@/utils/pricing-utils';

export const PricingMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [students, setStudents] = useState(5);
  const [users, setUsers] = useState(1);
  
  // Calculate price based on children and users - Updated for Educare App
  const customPrice = calculateEnterpriseCost(students, users);
  
  const handleStudentsChange = (value: number[]) => {
    setStudents(value[0]);
  };
  
  const handleUsersChange = (value: number[]) => {
    setUsers(value[0]);
  };
  
  const handleStudentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 100) {
      setStudents(value);
    }
  };
  
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      setUsers(value);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-16">
      <PricingHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="plans">
          <PricingPlans activeTab={activeTab} />
        </TabsContent>
        
        <TabsContent value="calculator">
          <EnterpriseCalculator
            activeTab={activeTab}
            students={students}
            users={users}
            customPrice={customPrice}
            handleStudentsChange={handleStudentsChange}
            handleUsersChange={handleUsersChange}
            handleStudentInput={handleStudentInput}
            handleUserInput={handleUserInput}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingMain;

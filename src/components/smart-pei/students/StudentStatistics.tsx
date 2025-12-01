
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useStudents, { Student } from '@/hooks/useStudents';

export const StudentStatistics: React.FC = () => {
  const { students } = useStudents();
  
  // Calculate statistics
  const calculateAgeGroups = () => {
    const ageGroups = {
      'Pré-escolar (3-5)': 0,
      'Fundamental I (6-10)': 0,
      'Fundamental II (11-14)': 0,
      'Ensino Médio (15-17)': 0,
      'Outros': 0
    };
    
    students.forEach(student => {
      const age = student.age;
      if (age >= 3 && age <= 5) ageGroups['Pré-escolar (3-5)']++;
      else if (age >= 6 && age <= 10) ageGroups['Fundamental I (6-10)']++;
      else if (age >= 11 && age <= 14) ageGroups['Fundamental II (11-14)']++;
      else if (age >= 15 && age <= 17) ageGroups['Ensino Médio (15-17)']++;
      else ageGroups['Outros']++;
    });
    
    return Object.entries(ageGroups)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };
  
  const calculateDiagnosisDistribution = () => {
    const diagnosisTypes = {
      'TEA': 0,
      'TDAH': 0,
      'Deficiência Intelectual': 0,
      'Síndrome de Down': 0,
      'Outros diagnósticos': 0,
      'Sem diagnóstico': 0
    };
    
    students.forEach(student => {
      if (!student.hasDiagnosis) {
        diagnosisTypes['Sem diagnóstico']++;
      } else {
        switch (student.diagnosisType) {
          case 'autism':
            diagnosisTypes['TEA']++;
            break;
          case 'adhd':
            diagnosisTypes['TDAH']++;
            break;
          case 'intellectual':
            diagnosisTypes['Deficiência Intelectual']++;
            break;
          case 'down':
            diagnosisTypes['Síndrome de Down']++;
            break;
          default:
            diagnosisTypes['Outros diagnósticos']++;
        }
      }
    });
    
    return Object.entries(diagnosisTypes)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };
  
  const ageData = calculateAgeGroups();
  const diagnosisData = calculateDiagnosisDistribution();
  
  const CHART_COLORS = ['#6E59A5', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#9CA3AF'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição por Idade</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={(entry) => entry.name}
              >
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} alunos`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Diagnósticos</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={diagnosisData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={(entry) => entry.name}
              >
                {diagnosisData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} alunos`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentStatistics;

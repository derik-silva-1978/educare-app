
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useReportsFilter } from '@/hooks/useReportsFilter';
import { Report } from '@/types/report';

export function useStudentReports(studentId: string, studentName: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Create student reports with proper typing
  const studentReports: Report[] = [
    {
      id: `${studentId}-r1`,
      title: 'Plano de Ensino Individualizado',
      description: 'Documento oficial do Plano Educacional Individualizado',
      type: 'pei',
      date: new Date().toISOString(),
      status: 'completed',
      studentName: studentName,
      studentId: studentId,
      coverImage: '/placeholder.svg',
      domainTracking: true,
      skillsTracking: true,
      progress: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: `${studentId}-r2`,
      title: 'Relatório de Progresso Mensal',
      description: 'Acompanhamento mensal do desenvolvimento do aluno',
      type: 'progress',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      studentName: studentName,
      studentId: studentId,
      coverImage: '/placeholder.svg',
      domainTracking: true,
      skillsTracking: true,
      progress: 100,
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: `${studentId}-r3`,
      title: 'Relatório de Progresso Trimestral',
      description: 'Documenta o progresso geral do aluno durante um trimestre',
      type: 'progress',
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      studentName: studentName,
      studentId: studentId,
      coverImage: '/placeholder.svg',
      domainTracking: true,
      skillsTracking: true,
      progress: 65,
      createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  const {
    reports,
    setReports,
    filteredReports,
    handleFilterChange
  } = useReportsFilter(studentReports);
  
  // Apply student ID filter initially
  useEffect(() => {
    handleFilterChange({ studentId });
  }, [studentId, handleFilterChange]);
  
  const handleGenerateReport = () => {
    navigate(`/smart-pei/reports/create?studentId=${studentId}&studentName=${encodeURIComponent(studentName)}`);
  };
  
  const handleViewReport = (reportId: string) => {
    navigate(`/smart-pei/reports/${reportId}`);
  };
  
  const handlePrintReport = (reportId: string) => {
    toast({
      title: "Preparando impressão",
      description: "Preparando o relatório para impressão..."
    });
  };
  
  const handleDownloadReport = (reportId: string) => {
    toast({
      title: "Download iniciado",
      description: "O relatório está sendo baixado..."
    });
  };
  
  const handleShareReport = (reportId: string) => {
    toast({
      title: "Compartilhar relatório",
      description: "Link para compartilhamento copiado para área de transferência"
    });
  };
  
  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter(r => r.id !== reportId));
    toast({
      title: "Relatório excluído",
      description: "O relatório foi removido com sucesso"
    });
  };

  return {
    reports,
    filteredReports,
    handleGenerateReport,
    handleViewReport,
    handlePrintReport,
    handleDownloadReport,
    handleShareReport,
    handleDeleteReport
  };
}

export default useStudentReports;

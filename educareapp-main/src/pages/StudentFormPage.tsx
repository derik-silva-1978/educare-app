
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import StudentForm from '@/components/smart-pei/students/StudentForm';
import { useToast } from '@/hooks/use-toast';
import useStudents from '@/hooks/useStudents';
import usePermissions from '@/hooks/usePermissions';

const StudentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id) && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getStudentById } = useStudents();
  const { hasPermission } = usePermissions();
  
  // Check permission to create/edit students
  React.useEffect(() => {
    const requiredPermission = isEditing ? 'student.edit' : 'student.create';
    if (!hasPermission(requiredPermission)) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para realizar esta ação',
        variant: 'destructive'
      });
      navigate('/smart-pei/students');
    }
  }, [isEditing, hasPermission, navigate, toast]);
  
  // Check if student exists when editing
  React.useEffect(() => {
    if (isEditing) {
      const student = getStudentById(id);
      if (!student) {
        toast({
          title: 'Estudante não encontrado',
          description: 'Não foi possível encontrar o estudante solicitado',
          variant: 'destructive'
        });
        navigate('/smart-pei/students');
      }
    }
  }, [id, isEditing, getStudentById, navigate, toast]);
  
  return (
    <React.Fragment>
      <Helmet>
        <title>{isEditing ? 'Editar' : 'Adicionar'} Estudante | Smart PEI</title>
        <meta 
          name="description" 
          content={`${isEditing ? 'Edite informações de um estudante existente' : 'Adicione um novo estudante ao sistema'}`} 
        />
      </Helmet>
      
      <main className="min-h-screen bg-gray-50 pb-12 pt-20">
        <div className="container mx-auto px-4">
          <div className="section-header mb-8">
            <h1 className="text-2xl font-bold text-primary text-center">
              {isEditing ? 'Editar Estudante' : 'Adicionar Novo Estudante'}
            </h1>
            <p className="text-gray-600 text-center">
              {isEditing 
                ? 'Atualize as informações do estudante' 
                : 'Preencha o formulário para adicionar um novo estudante'}
            </p>
          </div>
          
          <StudentForm studentId={isEditing ? id : undefined} />
        </div>
      </main>
    </React.Fragment>
  );
};

export default StudentFormPage;

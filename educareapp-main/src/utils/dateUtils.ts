
export const calculateAge = (birthdate: string) => {
  const birth = new Date(birthdate);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  
  // Ajustar se o dia ainda não chegou no mês atual
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  
  // Ajustar se o mês ainda não chegou no ano atual
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return { years, months, days };
};

// Função para formatar idade de forma inteligente
export const formatAge = (birthdate: string): string => {
  const { years, months, days } = calculateAge(birthdate);
  
  // Maior que 2 anos: mostrar só anos
  if (years >= 2) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  }
  
  // Maior que 1 ano: mostrar anos e meses
  if (years >= 1) {
    if (months === 0) {
      return `${years} ano`;
    }
    return `${years} ano ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  
  // Menor que 1 ano mas maior que 1 mês: mostrar só meses
  if (months >= 1) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  
  // Menor que 1 mês: mostrar só dias
  if (days === 0) {
    return 'Recém-nascido';
  }
  
  return `${days} ${days === 1 ? 'dia' : 'dias'}`;
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

export const formatDateTime = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleString('pt-BR');
};

// Calcula a idade em meses a partir da data de nascimento
export const calculateAgeInMonths = (birthdate: string | Date): number => {
  const birth = new Date(birthdate);
  const today = new Date();
  
  const years = today.getFullYear() - birth.getFullYear();
  const months = today.getMonth() - birth.getMonth();
  
  // Total de meses = (anos * 12) + meses
  const totalMonths = (years * 12) + months;
  
  // Ajuste para quando o dia do mês atual é menor que o dia de nascimento
  const adjustForDay = today.getDate() < birth.getDate() ? -1 : 0;
  
  return Math.max(0, totalMonths + adjustForDay);
};

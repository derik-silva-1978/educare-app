
// Function to calculate enterprise license cost - Updated for Educare App
export const calculateEnterpriseCost = (children: number, users: number): number => {
  // Base price for Enterprise plan - Educare App
  const basePrice = 199.00;
  
  // Additional price per child beyond 5
  const pricePerExtraChild = 25;
  
  // Additional price per user beyond 1
  const pricePerExtraUser = 20;
  
  // Calculate extra costs
  const extraChildCost = children > 5 ? (children - 5) * pricePerExtraChild : 0;
  const extraUserCost = users > 1 ? (users - 1) * pricePerExtraUser : 0;
  
  // Calculate total price
  const totalPrice = basePrice + extraChildCost + extraUserCost;
  
  return parseFloat(totalPrice.toFixed(2));
};

// Function to calculate annual discount
export const calculateAnnualPrice = (monthlyPrice: number, discountPercent: number = 17): number => {
  const annualPrice = monthlyPrice * 12;
  const discountAmount = annualPrice * (discountPercent / 100);
  return parseFloat((annualPrice - discountAmount).toFixed(2));
};

// Get plan details by plan ID
export const getPlanDetails = (planId: number) => {
  const plans = {
    1: {
      name: "Plano Gratuito",
      monthlyPrice: 0,
      annualPrice: 0,
      features: ["1 perfil de criança", "TitiNauta (Web + WhatsApp)", "Blog"],
      trial: 30
    },
    2: {
      name: "Plano Básico", 
      monthlyPrice: 19.90,
      annualPrice: 199.90,
      features: ["1 perfil de criança", "TitiNauta (Web)", "Relatórios Básicos", "Academia", "Blog"]
    },
    3: {
      name: "Plano Premium",
      monthlyPrice: 29.00,
      annualPrice: 299.00,
      features: ["1 perfil de criança", "TitiNauta (Web + WhatsApp)", "Relatórios Detalhados", "Grupos de Pais", "Lives"]
    },
    4: {
      name: "Plano Empresarial",
      monthlyPrice: 199.00,
      annualPrice: 1999.00,
      features: ["Até 5 crianças", "TitiNauta completo", "Painel multi-criança", "Relatórios IA", "Mentorias"]
    }
  };
  
  return plans[planId as keyof typeof plans] || null;
};

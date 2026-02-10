const normalizePhoneNumber = (phone) => {
  if (!phone) return null;
  
  let normalized = phone.replace(/\D/g, '');
  
  if (normalized.length === 0) return null;
  
  if (normalized.length >= 12 && normalized.startsWith('55')) {
    return '+' + normalized;
  }
  
  if (normalized.length === 10 || normalized.length === 11) {
    return '+55' + normalized;
  }
  
  if (normalized.length === 12 || normalized.length === 13) {
    if (normalized.startsWith('55')) {
      return '+' + normalized;
    }
  }
  
  if (normalized.length === 8 || normalized.length === 9) {
    console.warn(`Telefone local sem DDD (${normalized.length} dígitos): ${phone} - requer DDD`);
    return null;
  }
  
  if (normalized.length >= 10) {
    return '+' + normalized;
  }
  
  console.warn(`Telefone com formato inválido (${normalized.length} dígitos): ${phone}`);
  return null;
};

const extractPhoneVariants = (phone) => {
  if (!phone) return [];
  
  let digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length === 0) return [];
  
  const variants = new Set();
  
  if (digitsOnly.length >= 12 && digitsOnly.startsWith('55')) {
    variants.add('+' + digitsOnly);
    variants.add(digitsOnly);
    variants.add(digitsOnly.substring(2));
    variants.add('+' + digitsOnly.substring(2));
    
    const localWithDDD = digitsOnly.substring(2);
    if (localWithDDD.length === 11 && localWithDDD[2] === '9') {
      const without9 = localWithDDD.substring(0, 2) + localWithDDD.substring(3);
      variants.add(without9);
      variants.add('+55' + without9);
      variants.add('55' + without9);
    }
  }
  else if (digitsOnly.length === 10 || digitsOnly.length === 11) {
    const withCountry = '55' + digitsOnly;
    variants.add('+' + withCountry);
    variants.add(withCountry);
    variants.add(digitsOnly);
    variants.add('+' + digitsOnly);
    
    if (digitsOnly.length === 11 && digitsOnly[2] === '9') {
      const without9 = digitsOnly.substring(0, 2) + digitsOnly.substring(3);
      variants.add(without9);
      variants.add('+55' + without9);
      variants.add('55' + without9);
    }
  }
  else if (digitsOnly.length === 8 || digitsOnly.length === 9) {
    variants.add(digitsOnly);
    variants.add('+' + digitsOnly);
    
    if (digitsOnly.length === 9 && digitsOnly[0] === '9') {
      const without9 = digitsOnly.substring(1);
      variants.add(without9);
    }
  }
  
  const unique = [...variants].filter(v => v && v.length >= 8);
  return unique;
};

const findUserByPhone = async (User, phone, options = {}) => {
  const { Op } = require('sequelize');
  const { normalize = false, ...queryOptions } = options;
  
  const variants = extractPhoneVariants(phone);
  
  if (variants.length === 0) {
    console.warn(`Nenhuma variante de telefone gerada para: ${phone}`);
    return null;
  }
  
  console.log(`Buscando usuário com telefone. Variantes: [${variants.join(', ')}]`);
  
  const user = await User.findOne({
    where: {
      phone: { [Op.in]: variants }
    },
    ...queryOptions
  });
  
  if (user && normalize) {
    const normalizedPhone = normalizePhoneNumber(phone);
    if (normalizedPhone && user.phone !== normalizedPhone) {
      console.log(`Normalizando telefone de ${user.phone} para ${normalizedPhone}`);
      await user.update({ phone: normalizedPhone });
    }
  }
  
  return user;
};

const isValidBrazilianPhone = (phone) => {
  if (!phone) return false;
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length === 12 || digitsOnly.length === 13) {
    return digitsOnly.startsWith('55');
  }
  
  if (digitsOnly.length === 10 || digitsOnly.length === 11) {
    const ddd = parseInt(digitsOnly.substring(0, 2), 10);
    return ddd >= 11 && ddd <= 99;
  }
  
  return false;
};

module.exports = {
  normalizePhoneNumber,
  extractPhoneVariants,
  findUserByPhone,
  isValidBrazilianPhone
};

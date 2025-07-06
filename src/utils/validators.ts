
export const validateEconetNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\s/g, '');
  return /^(077|078)\d{7}$/.test(cleanNumber);
};

export const validateNetOneNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\s/g, '');
  return /^071\d{7}$/.test(cleanNumber);
};

export const validateZimMobileNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\s/g, '');
  return /^(077|078|071)\d{7}$/.test(cleanNumber);
};

export const validateMeterNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\s/g, '');
  return /^\d{11}$/.test(cleanNumber);
};

export const validateTelOneAccount = (number: string): boolean => {
  const cleanNumber = number.replace(/\s/g, '');
  return /^\d{6,12}$/.test(cleanNumber);
};

export const validatePolicyNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\s/g, '');
  return /^[A-Z]{2}\d{8}$/.test(cleanNumber);
};

export const formatPhoneNumber = (number: string): string => {
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length >= 3) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return cleaned;
};

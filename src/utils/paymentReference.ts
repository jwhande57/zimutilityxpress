
export const generatePaymentReference = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ZMP${timestamp.slice(-8)}${random}`;
};

export const validatePaymentReference = (reference: string): boolean => {
  return /^ZMP\d{8}[A-Z0-9]{6}$/.test(reference);
};

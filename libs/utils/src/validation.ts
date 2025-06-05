/**
 * Remove formatação de documentos (CPF/CNPJ)
 */
function removeFormatting(document: string): string {
  return document.replace(/\D/g, '');
}

/**
 * Valida CPF brasileiro
 */
export function validateCPF(cpf: string): boolean {
  if (!cpf || typeof cpf !== 'string') {
    return false;
  }

  const cleanCPF = removeFormatting(cpf);

  // Verificar se tem 11 dígitos
  if (cleanCPF.length !== 11) {
    return false;
  }

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) firstDigit = 0;

  if (firstDigit !== parseInt(cleanCPF.charAt(9))) {
    return false;
  }

  // Validar segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) secondDigit = 0;

  return secondDigit === parseInt(cleanCPF.charAt(10));
}

/**
 * Valida CNPJ brasileiro
 */
export function validateCNPJ(cnpj: string): boolean {
  if (!cnpj || typeof cnpj !== 'string') {
    return false;
  }

  const cleanCNPJ = removeFormatting(cnpj);

  // Verificar se tem 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return false;
  }

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }

  // Validar primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
  }
  let firstDigit = sum % 11;
  firstDigit = firstDigit < 2 ? 0 : 11 - firstDigit;

  if (firstDigit !== parseInt(cleanCNPJ.charAt(12))) {
    return false;
  }

  // Validar segundo dígito verificador
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
  }
  let secondDigit = sum % 11;
  secondDigit = secondDigit < 2 ? 0 : 11 - secondDigit;

  return secondDigit === parseInt(cleanCNPJ.charAt(13));
}

/**
 * Valida documento (CPF ou CNPJ) automaticamente baseado no tamanho
 */
export function isValidDocument(document: string): boolean {
  if (!document || typeof document !== 'string') {
    return false;
  }

  const cleanDocument = removeFormatting(document);

  if (cleanDocument.length === 11) {
    return validateCPF(document);
  } else if (cleanDocument.length === 14) {
    return validateCNPJ(document);
  }

  return false;
} 
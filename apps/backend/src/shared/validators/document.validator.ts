import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

/* 
✅ Algoritmo oficial da Receita Federal
✅ Validação de dígitos verificadores
✅ Rejeita sequências inválidas (111.111.111-11)
✅ Remove formatação automaticamente
*/

@ValidatorConstraint({ name: 'isValidDocument', async: false })
export class DocumentValidator implements ValidatorConstraintInterface {
  validate(document: string, args: ValidationArguments) {
    if (!document) return false;
    
    // Remove caracteres especiais
    const cleanDocument = document.replace(/\D/g, '');
    
    if (cleanDocument.length === 11) {
      return this.isValidCPF(cleanDocument);
    } else if (cleanDocument.length === 14) {
      return this.isValidCNPJ(cleanDocument);
    }
    
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Documento deve ser um CPF ou CNPJ válido';
  }

  private isValidCPF(cpf: string): boolean {
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Valida primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    // Valida segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  private isValidCNPJ(cnpj: string): boolean {
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    // Valida primeiro dígito verificador
    let sum = 0;
    let weight = 2;
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(cnpj.charAt(12))) return false;

    // Valida segundo dígito verificador
    sum = 0;
    weight = 2;
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cnpj.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(cnpj.charAt(13))) return false;

    return true;
  }
} 
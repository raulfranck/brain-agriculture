import { validateCPF, validateCNPJ, isValidDocument } from './validation';

describe('Document Validation', () => {
  describe('validateCPF', () => {
    it('should validate valid CPF numbers', () => {
      const validCPFs = [
        '11144477735', // CPF válido
        '123.456.789-09', // CPF válido com formatação
        '12345678909', // CPF válido
      ];

      validCPFs.forEach(cpf => {
        expect(validateCPF(cpf)).toBe(true);
      });
    });

    it('should reject invalid CPF numbers', () => {
      const invalidCPFs = [
        '11111111111', // CPF com dígitos repetidos
        '12345678901', // CPF inválido
        '123.456.789-00', // CPF inválido com formatação
        '123456789', // CPF muito curto
        '1234567890123', // CPF muito longo
        '', // CPF vazio
        'abc.def.ghi-jk', // CPF com letras
      ];

      invalidCPFs.forEach(cpf => {
        expect(validateCPF(cpf)).toBe(false);
      });
    });

    it('should handle CPF with special formatting', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
      expect(validateCPF('111-444-777-35')).toBe(false); // Formato errado
      expect(validateCPF('111 444 777 35')).toBe(false); // Formato errado
    });
  });

  describe('validateCNPJ', () => {
    it('should validate valid CNPJ numbers', () => {
      const validCNPJs = [
        '11222333000181', // CNPJ válido
        '11.222.333/0001-81', // CNPJ válido com formatação
      ];

      validCNPJs.forEach(cnpj => {
        expect(validateCNPJ(cnpj)).toBe(true);
      });
    });

    it('should reject invalid CNPJ numbers', () => {
      const invalidCNPJs = [
        '11111111111111', // CNPJ com dígitos repetidos
        '12345678901234', // CNPJ inválido
        '11.222.333/0001-82', // CNPJ inválido com formatação
        '1122233300018', // CNPJ muito curto
        '112223330001812', // CNPJ muito longo
        '', // CNPJ vazio
        'ab.cde.fgh/ijkl-mn', // CNPJ com letras
      ];

      invalidCNPJs.forEach(cnpj => {
        expect(validateCNPJ(cnpj)).toBe(false);
      });
    });

    it('should handle CNPJ with special formatting', () => {
      expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
      expect(validateCNPJ('11-222-333-0001-81')).toBe(false); // Formato errado
      expect(validateCNPJ('11 222 333 0001 81')).toBe(false); // Formato errado
    });
  });

  describe('isValidDocument', () => {
    it('should validate CPF when document has 11 digits', () => {
      expect(isValidDocument('11144477735')).toBe(true); // CPF válido
      expect(isValidDocument('12345678901')).toBe(false); // CPF inválido
    });

    it('should validate CNPJ when document has 14 digits', () => {
      expect(isValidDocument('11222333000181')).toBe(true); // CNPJ válido
      expect(isValidDocument('12345678901234')).toBe(false); // CNPJ inválido
    });

    it('should return false for documents with invalid length', () => {
      expect(isValidDocument('123')).toBe(false); // Muito curto
      expect(isValidDocument('123456789012345')).toBe(false); // Muito longo
      expect(isValidDocument('')).toBe(false); // Vazio
    });

    it('should handle documents with formatting', () => {
      expect(isValidDocument('111.444.777-35')).toBe(true); // CPF formatado
      expect(isValidDocument('11.222.333/0001-81')).toBe(true); // CNPJ formatado
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined values', () => {
      expect(validateCPF(null as any)).toBe(false);
      expect(validateCPF(undefined as any)).toBe(false);
      expect(validateCNPJ(null as any)).toBe(false);
      expect(validateCNPJ(undefined as any)).toBe(false);
      expect(isValidDocument(null as any)).toBe(false);
      expect(isValidDocument(undefined as any)).toBe(false);
    });

    it('should handle non-string values', () => {
      expect(validateCPF(12345678909 as any)).toBe(false);
      expect(validateCNPJ(11222333000181 as any)).toBe(false);
      expect(isValidDocument(12345678909 as any)).toBe(false);
    });

    it('should be case insensitive for any alpha characters (should reject)', () => {
      expect(validateCPF('ABC.DEF.GHI-JK')).toBe(false);
      expect(validateCPF('abc.def.ghi-jk')).toBe(false);
      expect(validateCNPJ('AB.CDE.FGH/IJKL-MN')).toBe(false);
      expect(validateCNPJ('ab.cde.fgh/ijkl-mn')).toBe(false);
    });
  });
}); 
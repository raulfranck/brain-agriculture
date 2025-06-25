import { DocumentValidator } from './document.validator';

describe('DocumentValidator', () => {
  let validator: DocumentValidator;

  beforeEach(() => {
    validator = new DocumentValidator();
  });

  describe('CPF Validation', () => {
    it('should validate valid CPF without formatting', () => {
      const validCPF = '11144477735'; // CPF válido
      expect(validator.validate(validCPF, {} as any)).toBe(true);
    });

    it('should validate valid CPF with formatting', () => {
      const validCPF = '111.444.777-35';
      expect(validator.validate(validCPF, {} as any)).toBe(true);
    });

    it('should reject CPF with all same digits', () => {
      const invalidCPF = '11111111111';
      expect(validator.validate(invalidCPF, {} as any)).toBe(false);
    });

    it('should reject CPF with invalid check digits', () => {
      const invalidCPF = '11144477736'; // Último dígito inválido
      expect(validator.validate(invalidCPF, {} as any)).toBe(false);
    });

    it('should reject CPF with wrong length', () => {
      const invalidCPF = '1114447773'; // 10 dígitos
      expect(validator.validate(invalidCPF, {} as any)).toBe(false);
    });

    it('should validate multiple valid CPFs', () => {
      const validCPFs = [
        '11144477735',
        '12345678909'
      ];

      validCPFs.forEach(cpf => {
        expect(validator.validate(cpf, {} as any)).toBe(true);
      });
    });

    it('should reject common invalid CPF sequences', () => {
      const invalidCPFs = [
        '00000000000',
        '11111111111', 
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
      ];

      invalidCPFs.forEach(cpf => {
        expect(validator.validate(cpf, {} as any)).toBe(false);
      });
    });
  });

  describe('CNPJ Validation', () => {
    it('should validate valid CNPJ without formatting', () => {
      const validCNPJ = '11222333000181'; // CNPJ válido
      expect(validator.validate(validCNPJ, {} as any)).toBe(true);
    });

    it('should validate valid CNPJ with formatting', () => {
      const validCNPJ = '11.222.333/0001-81';
      expect(validator.validate(validCNPJ, {} as any)).toBe(true);
    });

    it('should reject CNPJ with all same digits', () => {
      const invalidCNPJ = '11111111111111';
      expect(validator.validate(invalidCNPJ, {} as any)).toBe(false);
    });

    it('should reject CNPJ with invalid check digits', () => {
      const invalidCNPJ = '11222333000182'; // Último dígito inválido
      expect(validator.validate(invalidCNPJ, {} as any)).toBe(false);
    });

    it('should reject CNPJ with wrong length', () => {
      const invalidCNPJ = '1122233300018'; // 13 dígitos
      expect(validator.validate(invalidCNPJ, {} as any)).toBe(false);
    });

    it('should validate multiple valid CNPJs', () => {
      const validCNPJs = [
        '11222333000181',
        '12345678000195'
      ];

      validCNPJs.forEach(cnpj => {
        expect(validator.validate(cnpj, {} as any)).toBe(true);
      });
    });

    it('should reject common invalid CNPJ sequences', () => {
      const invalidCNPJs = [
        '00000000000000',
        '11111111111111',
        '22222222222222',
        '33333333333333',
        '44444444444444',
        '55555555555555',
        '66666666666666',
        '77777777777777',
        '88888888888888',
        '99999999999999'
      ];

      invalidCNPJs.forEach(cnpj => {
        expect(validator.validate(cnpj, {} as any)).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should reject empty string', () => {
      expect(validator.validate('', {} as any)).toBe(false);
    });

    it('should reject null', () => {
      expect(validator.validate(null as any, {} as any)).toBe(false);
    });

    it('should reject undefined', () => {
      expect(validator.validate(undefined as any, {} as any)).toBe(false);
    });

    it('should reject document with letters', () => {
      expect(validator.validate('1234567890a', {} as any)).toBe(false);
    });

    it('should reject document with special characters only', () => {
      expect(validator.validate('...-/', {} as any)).toBe(false);
    });

    it('should handle document with mixed characters', () => {
      // Remove caracteres especiais e valida apenas números
      const mixedCPF = '111.444.777-35abc';
      expect(validator.validate(mixedCPF, {} as any)).toBe(true);
    });
  });

  describe('Default Message', () => {
    it('should return default error message', () => {
      const message = validator.defaultMessage({} as any);
      expect(message).toBe('Documento deve ser um CPF ou CNPJ válido');
    });
  });

  describe('Performance', () => {
    it('should validate many documents quickly', () => {
      const documents = Array.from({length: 1000}, (_, i) => 
        i % 2 === 0 ? '11144477735' : '11222333000181'
      );
      
      const start = performance.now();
      documents.forEach(doc => validator.validate(doc, {} as any));
      const end = performance.now();
      
      expect(end - start).toBeLessThan(1000); // Menos de 1 segundo
    });
  });
}); 
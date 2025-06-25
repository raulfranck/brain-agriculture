import { BadRequestException } from '@nestjs/common';
import { Farm } from './farm.entity';

describe('Farm Entity', () => {
  let farm: Farm;

  beforeEach(() => {
    farm = new Farm();
    farm.id = 'farm-123';
    farm.name = 'Fazenda Teste';
    farm.city = 'São Paulo';
    farm.state = 'SP';
    farm.producerId = 'producer-123';
    farm.harvests = [];
  });

  describe('validateAreas', () => {
    it('should validate when areas are within total area', () => {
      farm.totalArea = 1000;
      farm.arableArea = 600;
      farm.vegetationArea = 300;

      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should validate when areas equal total area', () => {
      farm.totalArea = 1000;
      farm.arableArea = 600;
      farm.vegetationArea = 400;

      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should throw BadRequestException when areas exceed total', () => {
      farm.totalArea = 1000;
      farm.arableArea = 700;
      farm.vegetationArea = 400; // 700 + 400 = 1100 > 1000

      expect(() => farm.validateAreas()).toThrow(BadRequestException);
      expect(() => farm.validateAreas()).toThrow(
        'Área agricultável (700) + vegetação (400) = 1100 não pode exceder a área total (1000)'
      );
    });

    it('should handle zero arable area', () => {
      farm.totalArea = 1000;
      farm.arableArea = 0;
      farm.vegetationArea = 1000;

      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should handle zero vegetation area', () => {
      farm.totalArea = 1000;
      farm.arableArea = 1000;
      farm.vegetationArea = 0;

      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should handle both areas as zero', () => {
      farm.totalArea = 1000;
      farm.arableArea = 0;
      farm.vegetationArea = 0;

      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should handle decimal values correctly', () => {
      farm.totalArea = 1000.5;
      farm.arableArea = 600.3;
      farm.vegetationArea = 400.2; // 600.3 + 400.2 = 1000.5

      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should throw error with decimal values when exceeding total', () => {
      farm.totalArea = 1000.5;
      farm.arableArea = 600.3;
      farm.vegetationArea = 400.3; // 600.3 + 400.3 = 1000.6 > 1000.5

      expect(() => farm.validateAreas()).toThrow(BadRequestException);
      expect(() => farm.validateAreas()).toThrow(
        'não pode exceder a área total'
      );
    });

    it('should handle very small differences', () => {
      farm.totalArea = 100.001;
      farm.arableArea = 50.0005;
      farm.vegetationArea = 50.0005; // 50.0005 + 50.0005 = 100.001

      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should catch very small overages', () => {
      farm.totalArea = 100;
      farm.arableArea = 50.001;
      farm.vegetationArea = 50.001; // 50.001 + 50.001 = 100.002 > 100

      expect(() => farm.validateAreas()).toThrow(BadRequestException);
    });

    it('should handle large numbers', () => {
      farm.totalArea = 999999.99;
      farm.arableArea = 500000;
      farm.vegetationArea = 499999.99; // Within total

      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should provide accurate error message with actual calculations', () => {
      farm.totalArea = 1000;
      farm.arableArea = 750;
      farm.vegetationArea = 300; // 750 + 300 = 1050 > 1000

      try {
        farm.validateAreas();
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toContain('750');
        expect(error.message).toContain('300');
        expect(error.message).toContain('1050');
        expect(error.message).toContain('1000');
        expect(error.message).toContain('não pode exceder');
      }
    });
  });

  describe('Entity properties', () => {
    it('should have all required properties', () => {
      expect(farm).toHaveProperty('id');
      expect(farm).toHaveProperty('name');
      expect(farm).toHaveProperty('city');
      expect(farm).toHaveProperty('state');
      expect(farm).toHaveProperty('totalArea');
      expect(farm).toHaveProperty('arableArea');
      expect(farm).toHaveProperty('vegetationArea');
      expect(farm).toHaveProperty('producerId');
      expect(farm).toHaveProperty('harvests');
      expect(farm).toHaveProperty('validateAreas');
    });

    it('should be able to set all properties', () => {
      farm.totalArea = 1500;
      farm.arableArea = 900;
      farm.vegetationArea = 500;

      expect(farm.totalArea).toBe(1500);
      expect(farm.arableArea).toBe(900);
      expect(farm.vegetationArea).toBe(500);
    });
  });

  describe('Business logic validation', () => {
    it('should validate typical farm scenarios', () => {
      // Cenário 1: Fazenda com mais área agricultável
      farm.totalArea = 2000;
      farm.arableArea = 1200;
      farm.vegetationArea = 600;
      expect(() => farm.validateAreas()).not.toThrow();

      // Cenário 2: Fazenda com mais vegetação (reserva legal)
      farm.totalArea = 1000;
      farm.arableArea = 200;
      farm.vegetationArea = 800;
      expect(() => farm.validateAreas()).not.toThrow();

      // Cenário 3: Fazenda mista equilibrada
      farm.totalArea = 1000;
      farm.arableArea = 500;
      farm.vegetationArea = 500;
      expect(() => farm.validateAreas()).not.toThrow();
    });

    it('should prevent unrealistic farm configurations', () => {
      // Impossível: área util maior que total
      farm.totalArea = 100;
      farm.arableArea = 80;
      farm.vegetationArea = 30; // 80 + 30 = 110 > 100
      
      expect(() => farm.validateAreas()).toThrow(BadRequestException);
    });
  });
}); 
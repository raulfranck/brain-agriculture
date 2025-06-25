// Configuração global para testes
import 'reflect-metadata';

// Mock do Logger para testes
jest.mock('nestjs-pino', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    verbose: jest.fn(),
  })),
}));

// Mock global para console methods em testes
const originalConsole = console;
beforeEach(() => {
  global.console = {
    ...originalConsole,
    // Suprimir logs durante testes, mas manter error para debugging
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: originalConsole.error,
  };
});

afterEach(() => {
  global.console = originalConsole;
});

// Timeout padrão para testes assíncronos
jest.setTimeout(10000);

// Configurar timezone para testes consistentes
process.env.TZ = 'UTC'; 
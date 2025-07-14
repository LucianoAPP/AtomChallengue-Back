import 'reflect-metadata';

// Configuración global para tests
beforeAll(() => {
  // Configurar variables de entorno para tests
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.LOG_LEVEL = 'error';
});

afterAll(() => {
  // Limpiar variables de entorno
  delete process.env.JWT_SECRET;
  delete process.env.LOG_LEVEL;
}); 
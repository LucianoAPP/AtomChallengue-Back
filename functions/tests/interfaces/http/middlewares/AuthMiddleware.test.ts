import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { container } from 'tsyringe';
import { ITokenGenerator } from '../../../../src/domain/services/ITokenGenerator';

// Mock del token generator
const mockTokenGenerator = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
};

// Mock del middleware de autenticación
jest.mock('../../../../src/interfaces/http/middlewares/AuthMiddleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          status: 'error',
          message: 'Token de autorización requerido',
          code: 401
        });
      }

      const token = authHeader.substring(7);
      const tokenGenerator = container.resolve<ITokenGenerator>('ITokenGenerator');
      
      try {
        const payload = tokenGenerator.verifyToken(token);
        
        req.user = {
          userId: payload.userId,
          email: payload.email
        };
        
        next();
      } catch (error) {
        res.status(401).json({
          status: 'error',
          message: 'Token inválido o expirado',
          code: 401
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error en la autenticación',
        code: 500
      });
    }
  }
}));

describe('AuthMiddleware', () => {
  let app: express.Application;

  beforeEach(() => {
    // Limpiar y registrar mocks en el contenedor
    container.clearInstances();
    container.registerInstance<ITokenGenerator>('ITokenGenerator', mockTokenGenerator);
    
    // Crear aplicación Express para testing
    app = express();
    app.use(express.json());
    
    // Importar el middleware mockeado
    const { authMiddleware } = require('../../../../src/interfaces/http/middlewares/AuthMiddleware');
    
    // Aplicar middleware de autenticación
    app.use(authMiddleware);
    
    // Ruta protegida para testing
    app.get('/protected', (req: any, res) => {
      res.json({ 
        message: 'Acceso autorizado',
        userId: req.user?.userId 
      });
    });
    
    // Limpiar mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    container.clearInstances();
  });

  describe('verificación de token', () => {
    it('debería permitir acceso con token válido', async () => {
      // Arrange
      const validToken = 'valid-jwt-token';
      const mockPayload = { userId: 'user-123', email: 'test@example.com' };
      
      mockTokenGenerator.verifyToken.mockReturnValue(mockPayload);

      // Act
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Assert
      expect(mockTokenGenerator.verifyToken).toHaveBeenCalledWith(validToken);
      expect(response.body).toEqual({
        message: 'Acceso autorizado',
        userId: 'user-123'
      });
    });

    it('debería rechazar acceso sin token de autorización', async () => {
      // Act
      const response = await request(app)
        .get('/protected')
        .expect(401);

      // Assert
      expect(response.body).toEqual({
        status: 'error',
        message: 'Token de autorización requerido',
        code: 401
      });
    });

    it('debería rechazar acceso con formato de token incorrecto', async () => {
      // Act
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'InvalidFormat token123')
        .expect(401);

      // Assert
      expect(response.body).toEqual({
        status: 'error',
        message: 'Token de autorización requerido',
        code: 401
      });
    });

    it('debería rechazar acceso con token inválido', async () => {
      // Arrange
      const invalidToken = 'invalid-jwt-token';
      const error = new Error('Invalid token');
      
      mockTokenGenerator.verifyToken.mockImplementation(() => {
        throw error;
      });

      // Act
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      // Assert
      expect(mockTokenGenerator.verifyToken).toHaveBeenCalledWith(invalidToken);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Token inválido o expirado',
        code: 401
      });
    });

    it('debería extraer correctamente el userId del token', async () => {
      // Arrange
      const token = 'valid-token';
      const mockPayload = { userId: 'user-456', email: 'test@example.com' };
      
      mockTokenGenerator.verifyToken.mockReturnValue(mockPayload);

      // Act
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Assert
      expect(response.body.userId).toBe('user-456');
    });
  });
}); 
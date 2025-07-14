import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { AuthController } from '../../../../src/interfaces/http/controllers/AuthController';

// Mock de los casos de uso
const mockLoginUseCase = {
  execute: jest.fn(),
};

const mockRegisterUseCase = {
  execute: jest.fn(),
};

describe('AuthController', () => {
  let app: express.Application;
  let authController: AuthController;

  beforeEach(() => {
    // Crear aplicación Express para testing
    app = express();
    app.use(express.json());
    
    // Crear controlador con mocks inyectados
    authController = new AuthController(mockLoginUseCase as any, mockRegisterUseCase as any);
    
    // Configurar rutas
    app.post('/auth/login', (req, res) => authController.login(req, res));
    app.post('/auth/register', (req, res) => authController.register(req, res));
    
    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('debería retornar 200 con token y usuario cuando el login es exitoso', async () => {
      // Arrange
      const loginData = { email: 'test@example.com' };
      const mockResult = {
        status: 'ok' as const,
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          createdAt: new Date('2024-01-01')
        }
      };

      mockLoginUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      // Assert
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginData);
      expect(response.body).toEqual({
        status: 'ok',
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      });
    });

    it('debería retornar 404 cuando el usuario no existe', async () => {
      // Arrange
      const loginData = { email: 'nonexistent@example.com' };
      const mockResult = { status: 'not_found' as const };

      mockLoginUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(404);

      // Assert
      expect(mockLoginUseCase.execute).toHaveBeenCalledWith(loginData);
      expect(response.body).toEqual({
        status: 'not_found',
        message: 'Usuario no encontrado'
      });
    });

    it('debería retornar 500 cuando ocurre un error', async () => {
      // Arrange
      const loginData = { email: 'test@example.com' };
      const error = new Error('Database error');

      mockLoginUseCase.execute.mockRejectedValue(error);

      // Act
      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        status: 'error',
        message: 'Error en el inicio de sesión',
        code: 500
      });
    });
  });

  describe('POST /auth/register', () => {
    it('debería retornar 201 con token y usuario cuando el registro es exitoso', async () => {
      // Arrange
      const registerData = { email: 'newuser@example.com' };
      const mockResult = {
        token: 'mock-jwt-token',
        user: {
          id: 'user-456',
          email: 'newuser@example.com',
          createdAt: new Date('2024-01-01')
        }
      };

      mockRegisterUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      // Assert
      expect(mockRegisterUseCase.execute).toHaveBeenCalledWith(registerData);
      expect(response.body).toEqual({
        status: 'created',
        token: 'mock-jwt-token',
        user: {
          id: 'user-456',
          email: 'newuser@example.com',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      });
    });

    it('debería retornar 500 cuando ocurre un error en el registro', async () => {
      // Arrange
      const registerData = { email: 'test@example.com' };
      const error = new Error('User already exists');

      mockRegisterUseCase.execute.mockRejectedValue(error);

      // Act
      const response = await request(app)
        .post('/auth/register')
        .send(registerData)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        status: 'error',
        message: 'Error en el registro',
        code: 500
      });
    });
  });
}); 
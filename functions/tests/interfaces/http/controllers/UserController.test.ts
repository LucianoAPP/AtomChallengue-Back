import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { UserController } from '../../../../src/interfaces/http/controllers/UserController';
import { User } from '../../../../src/domain/entities/User';
import { Email } from '../../../../src/domain/value-objects/Email';
import { UserId } from '../../../../src/domain/value-objects/UserId';

// Mock de los casos de uso y repositorios
const mockCreateUserUseCase = {
  execute: jest.fn(),
};

const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

describe('UserController', () => {
  let app: express.Application;
  let userController: UserController;

  beforeEach(() => {
    // Crear aplicación Express para testing
    app = express();
    app.use(express.json());
    
    // Crear controlador con mocks inyectados
    userController = new UserController(
      mockCreateUserUseCase as any,
      mockUserRepository as any
    );
    
    // Configurar rutas
    app.post('/users', (req, res) => userController.createUser(req, res));
    app.get('/users', (req, res) => userController.getUserByEmail(req, res));
    
    // Limpiar mocks
    jest.clearAllMocks();
  });

  describe('POST /users', () => {
    it('debería retornar 201 con usuario cuando la creación es exitosa', async () => {
      // Arrange
      const userData = { email: 'newuser@example.com' };
      const mockResult = {
        id: 'user-123',
        email: 'newuser@example.com',
        createdAt: new Date('2024-01-01')
      };

      mockCreateUserUseCase.execute.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      // Assert
      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(userData);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          id: 'user-123',
          email: 'newuser@example.com',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      });
    });

    it('debería retornar 500 cuando ocurre un error', async () => {
      // Arrange
      const userData = { email: 'test@example.com' };
      const error = new Error('Database error');

      mockCreateUserUseCase.execute.mockRejectedValue(error);

      // Act
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        status: 'error',
        message: 'Error al crear usuario',
        code: 500
      });
    });
  });

  describe('GET /users', () => {
    it('debería retornar 200 con usuario cuando existe', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockUser = new User(
        new UserId('user-123'),
        new Email(email),
        new Date('2024-01-01')
      );

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .get('/users')
        .query({ email })
        .expect(200);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          id: 'user-123',
          email: 'test@example.com',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      });
    });

    it('debería retornar 200 con status not_found cuando el usuario no existe', async () => {
      // Arrange
      const email = 'nonexistent@example.com';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .get('/users')
        .query({ email })
        .expect(200);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(response.body).toEqual({
        status: 'not_found',
        message: 'Usuario no encontrado',
        code: 200
      });
    });

    it('debería retornar 400 cuando no se proporciona email', async () => {
      // Act
      const response = await request(app)
        .get('/users')
        .expect(400);

      // Assert
      expect(response.body).toEqual({
        status: 'error',
        message: 'Email es requerido',
        code: 400
      });
    });

    it('debería retornar 500 cuando ocurre un error', async () => {
      // Arrange
      const email = 'test@example.com';
      const error = new Error('Database error');

      mockUserRepository.findByEmail.mockRejectedValue(error);

      // Act
      const response = await request(app)
        .get('/users')
        .query({ email })
        .expect(500);

      // Assert
      expect(response.body).toEqual({
        status: 'error',
        message: 'Error al obtener usuario',
        code: 500
      });
    });
  });
}); 
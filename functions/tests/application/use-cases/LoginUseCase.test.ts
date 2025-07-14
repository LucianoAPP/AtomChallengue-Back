import 'reflect-metadata';
import { container } from 'tsyringe';
import { LoginUseCase } from '../../../src/application/use-cases/LoginUseCase';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';
import { ITokenGenerator } from '../../../src/domain/services/ITokenGenerator';
import { User } from '../../../src/domain/entities/User';
import { Email } from '../../../src/domain/value-objects/Email';
import { UserId } from '../../../src/domain/value-objects/UserId';

// Mock del repositorio
const mockUserRepository = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

// Mock del token generator
const mockTokenGenerator = {
  generateToken: jest.fn().mockReturnValue('mock-jwt-token'),
  verifyToken: jest.fn(),
};

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;

  beforeEach(() => {
    // Limpiar el contenedor y registrar los mocks
    container.clearInstances();
    container.registerInstance<IUserRepository>('IUserRepository', mockUserRepository);
    container.registerInstance<ITokenGenerator>('ITokenGenerator', mockTokenGenerator);
    
    loginUseCase = container.resolve(LoginUseCase);
    
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    container.clearInstances();
  });

  describe('execute', () => {
    it('debería retornar status "ok" con token y usuario cuando el usuario existe', async () => {
      // Arrange
      const email = 'test@example.com';
      const userId = new UserId('user-123');
      const user = new User(
        userId,
        new Email(email),
        new Date('2024-01-01')
      );

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockTokenGenerator.generateToken.mockReturnValue('mock-jwt-token');

      // Act
      const result = await loginUseCase.execute({ email });

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockTokenGenerator.generateToken).toHaveBeenCalledWith({
        userId: 'user-123',
        email: 'test@example.com'
      });
      expect(result).toEqual({
        status: 'ok',
        token: 'mock-jwt-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          createdAt: new Date('2024-01-01')
        }
      });
    });

    it('debería retornar status "not_found" cuando el usuario no existe', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await loginUseCase.execute({ email });

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockTokenGenerator.generateToken).not.toHaveBeenCalled();
      expect(result).toEqual({
        status: 'not_found'
      });
    });

    it('debería generar un token JWT con el userId y email correctos', async () => {
      // Arrange
      const email = 'test@example.com';
      const userId = new UserId('user-456');
      const user = new User(
        userId,
        new Email(email),
        new Date('2024-01-01')
      );

      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockTokenGenerator.generateToken.mockReturnValue('mock-jwt-token');

      // Act
      const result = await loginUseCase.execute({ email });

      // Assert
      expect(result.status).toBe('ok');
      expect(result.token).toBe('mock-jwt-token');
      expect(mockTokenGenerator.generateToken).toHaveBeenCalledWith({
        userId: 'user-456',
        email: 'test@example.com'
      });
    });

    it('debería manejar errores del repositorio', async () => {
      // Arrange
      const email = 'test@example.com';
      const error = new Error('Database error');
      mockUserRepository.findByEmail.mockRejectedValue(error);

      // Act & Assert
      await expect(loginUseCase.execute({ email })).rejects.toThrow('Database error');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });
}); 
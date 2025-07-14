import 'reflect-metadata';
import { container } from 'tsyringe';
import { RegisterUseCase } from '../../../src/application/use-cases/RegisterUseCase';
import { IUserRepository } from '../../../src/domain/repositories/IUserRepository';
import { ITokenGenerator } from '../../../src/domain/services/ITokenGenerator';
import { User } from '../../../src/domain/entities/User';
import { Email } from '../../../src/domain/value-objects/Email';
import { UserId } from '../../../src/domain/value-objects/UserId';
import { ConflictError } from '../../../src/shared/errors/DomainError';

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

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;

  beforeEach(() => {
    // Limpiar el contenedor y registrar los mocks
    container.clearInstances();
    container.registerInstance<IUserRepository>('IUserRepository', mockUserRepository);
    container.registerInstance<ITokenGenerator>('ITokenGenerator', mockTokenGenerator);
    
    registerUseCase = container.resolve(RegisterUseCase);
    
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    container.clearInstances();
  });

  describe('execute', () => {
    it('debería crear un nuevo usuario y retornar token cuando el email no existe', async () => {
      // Arrange
      const email = 'newuser@example.com';
      const userId = new UserId('user-789');
      const user = new User(
        userId,
        new Email(email),
        new Date('2024-01-01')
      );

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(user);
      mockTokenGenerator.generateToken.mockReturnValue('mock-jwt-token');

      // Act
      const result = await registerUseCase.execute({ email });

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockTokenGenerator.generateToken).toHaveBeenCalledWith({
        userId: 'user-789',
        email: 'newuser@example.com'
      });
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: 'user-789',
          email: 'newuser@example.com',
          createdAt: new Date('2024-01-01')
        }
      });
    });

    it('debería lanzar ConflictError cuando el usuario ya existe', async () => {
      // Arrange
      const email = 'existing@example.com';
      const existingUser = new User(
        new UserId('existing-user'),
        new Email(email),
        new Date('2024-01-01')
      );

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(registerUseCase.execute({ email })).rejects.toThrow(ConflictError);
      await expect(registerUseCase.execute({ email })).rejects.toThrow('El usuario ya existe');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockTokenGenerator.generateToken).not.toHaveBeenCalled();
    });

    it('debería generar un token JWT para el nuevo usuario', async () => {
      // Arrange
      const email = 'newuser@example.com';
      const userId = new UserId('user-999');
      const user = new User(
        userId,
        new Email(email),
        new Date('2024-01-01')
      );

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(user);
      mockTokenGenerator.generateToken.mockReturnValue('mock-jwt-token');

      // Act
      const result = await registerUseCase.execute({ email });

      // Assert
      expect(result.token).toBe('mock-jwt-token');
      expect(mockTokenGenerator.generateToken).toHaveBeenCalledWith({
        userId: 'user-999',
        email: 'newuser@example.com'
      });
    });

    it('debería manejar errores del repositorio', async () => {
      // Arrange
      const email = 'test@example.com';
      const error = new Error('Database error');
      mockUserRepository.findByEmail.mockRejectedValue(error);

      // Act & Assert
      await expect(registerUseCase.execute({ email })).rejects.toThrow('Database error');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
    });
  });
}); 
import 'reflect-metadata';
import { container } from 'tsyringe';
import { CreateTaskUseCase } from '../../../src/application/use-cases/CreateTaskUseCase';
import { ITaskRepository } from '../../../src/domain/repositories/ITaskRepository';
import { Task } from '../../../src/domain/entities/Task';
import { TaskId } from '../../../src/domain/value-objects/TaskId';
import { UserId } from '../../../src/domain/value-objects/UserId';
import { TaskStatus } from '../../../src/domain/enums/TaskStatus';

// Mock del repositorio
const mockTaskRepository = {
  findById: jest.fn(),
  findAllByUser: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('CreateTaskUseCase', () => {
  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    // Limpiar el contenedor y registrar el mock
    container.clearInstances();
    container.registerInstance<ITaskRepository>('ITaskRepository', mockTaskRepository);
    
    createTaskUseCase = container.resolve(CreateTaskUseCase);
    
    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    container.clearInstances();
  });

  describe('execute', () => {
    it('debería crear una nueva tarea y retornar la tarea creada', async () => {
      // Arrange
      const dto = {
        title: 'Nueva tarea',
        description: 'Descripción de la tarea'
      };
      const userId = 'user-123';
      
      const createdTask = new Task(
        new TaskId('task-456'),
        new UserId(userId),
        dto.title,
        dto.description,
        TaskStatus.PENDING,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      mockTaskRepository.create.mockResolvedValue(createdTask);

      // Act
      const result = await createTaskUseCase.execute(dto, userId);

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: 'task-456',
        userId: 'user-123',
        title: 'Nueva tarea',
        description: 'Descripción de la tarea',
        status: TaskStatus.PENDING,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      });
    });

    it('debería crear una tarea con descripción vacía cuando no se proporciona', async () => {
      // Arrange
      const dto = {
        title: 'Tarea sin descripción'
      };
      const userId = 'user-123';
      
      const createdTask = new Task(
        new TaskId('task-789'),
        new UserId(userId),
        dto.title,
        '',
        TaskStatus.PENDING,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      mockTaskRepository.create.mockResolvedValue(createdTask);

      // Act
      const result = await createTaskUseCase.execute(dto, userId);

      // Assert
      expect(mockTaskRepository.create).toHaveBeenCalled();
      expect(result.description).toBe('');
    });

    it('debería manejar errores del repositorio', async () => {
      // Arrange
      const dto = {
        title: 'Tarea con error',
        description: 'Descripción'
      };
      const userId = 'user-123';
      const error = new Error('Database error');

      mockTaskRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(createTaskUseCase.execute(dto, userId)).rejects.toThrow('Database error');
      expect(mockTaskRepository.create).toHaveBeenCalled();
    });
  });
}); 
import 'reflect-metadata';
import { container } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { ITokenGenerator } from '../../domain/services/ITokenGenerator';
import { ILogger } from '../../domain/services/ILogger';
import { FirestoreUserRepository } from '../persistence/FirestoreUserRepository';
import { FirestoreTaskRepository } from '../persistence/FirestoreTaskRepository';
import { JWTTokenGenerator } from '../services/JWTTokenGenerator';
import { WinstonLogger } from '../logger/WinstonLogger';

// Casos de uso de autenticación
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';

// Casos de uso de usuarios
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';

// Casos de uso de tareas
import { CreateTaskUseCase } from '../../application/use-cases/CreateTaskUseCase';
import { ListTasksUseCase } from '../../application/use-cases/ListTasksUseCase';
import { UpdateTaskUseCase } from '../../application/use-cases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/use-cases/DeleteTaskUseCase';

// Registrar repositorios
container.registerSingleton<IUserRepository>('IUserRepository', FirestoreUserRepository);
container.registerSingleton<ITaskRepository>('ITaskRepository', FirestoreTaskRepository);

// Registrar servicios
container.registerSingleton<ITokenGenerator>('ITokenGenerator', JWTTokenGenerator);
container.registerSingleton<ILogger>('ILogger', WinstonLogger);

// Registrar casos de uso de autenticación
container.registerSingleton(LoginUseCase);
container.registerSingleton(RegisterUseCase);

// Registrar casos de uso de usuarios
container.registerSingleton(CreateUserUseCase);

// Registrar casos de uso de tareas
container.registerSingleton(CreateTaskUseCase);
container.registerSingleton(ListTasksUseCase);
container.registerSingleton(UpdateTaskUseCase);
container.registerSingleton(DeleteTaskUseCase);

export { container }; 
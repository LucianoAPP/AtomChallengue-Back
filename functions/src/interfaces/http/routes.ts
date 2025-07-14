import { Router } from 'express';
import { container } from 'tsyringe';
import { UserController } from './controllers/UserController';
import { TaskController } from './controllers/TaskController';
import { AuthController } from './controllers/AuthController';
import { validationMiddleware } from './middlewares/ValidationMiddleware';
import { authMiddleware } from './middlewares/AuthMiddleware';
import { CreateUserDTO } from '../../application/dto/CreateUserDTO';
import { CreateTaskDTO } from '../../application/dto/CreateTaskDTO';
import { UpdateTaskDTO } from '../../application/dto/UpdateTaskDTO';
import { LoginDTO } from '../../application/dto/LoginDTO';
import { RegisterDTO } from '../../application/dto/RegisterDTO';

// Casos de uso de autenticación
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';

// Casos de uso de usuarios
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

// Casos de uso de tareas
import { CreateTaskUseCase } from '../../application/use-cases/CreateTaskUseCase';
import { ListTasksUseCase } from '../../application/use-cases/ListTasksUseCase';
import { UpdateTaskUseCase } from '../../application/use-cases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../application/use-cases/DeleteTaskUseCase';

export function createRoutes(): Router {
    const router = Router();

    // Resolver dependencias para AuthController
    const loginUseCase = container.resolve(LoginUseCase);
    const registerUseCase = container.resolve(RegisterUseCase);
    const authController = new AuthController(loginUseCase, registerUseCase);

    // Resolver dependencias para UserController
    const createUserUseCase = container.resolve(CreateUserUseCase);
    const userRepository = container.resolve<IUserRepository>('IUserRepository');
    const userController = new UserController(createUserUseCase, userRepository);

    // Resolver dependencias para TaskController
    const createTaskUseCase = container.resolve(CreateTaskUseCase);
    const listTasksUseCase = container.resolve(ListTasksUseCase);
    const updateTaskUseCase = container.resolve(UpdateTaskUseCase);
    const deleteTaskUseCase = container.resolve(DeleteTaskUseCase);
    const taskController = new TaskController(
        createTaskUseCase,
        listTasksUseCase,
        updateTaskUseCase,
        deleteTaskUseCase
    );

    // Rutas de autenticación (sin autenticación)
    router.post('/v1/auth/login', 
        validationMiddleware(LoginDTO),
        authController.login.bind(authController)
    );
    router.post('/v1/auth/register', 
        validationMiddleware(RegisterDTO),
        authController.register.bind(authController)
    );

    // Rutas de usuarios (sin autenticación)
    router.get('/v1/users', userController.getUserByEmail.bind(userController));
    router.post('/v1/users', 
        validationMiddleware(CreateUserDTO),
        userController.createUser.bind(userController)
    );

    // Rutas de tareas (con autenticación)
    router.get('/v1/tasks', 
        authMiddleware,
        taskController.listTasks.bind(taskController)
    );
  
    router.post('/v1/tasks', 
        authMiddleware,
        validationMiddleware(CreateTaskDTO),
        taskController.createTask.bind(taskController)
    );
  
    router.put('/v1/tasks/:id', 
        authMiddleware,
        validationMiddleware(UpdateTaskDTO),
        taskController.updateTask.bind(taskController)
    );
  
    router.delete('/v1/tasks/:id', 
        authMiddleware,
        taskController.deleteTask.bind(taskController)
    );

    // Health check
    router.get('/v1/healthz', (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'API funcionando correctamente',
            timestamp: new Date().toISOString()
        });
    });

    return router;
} 
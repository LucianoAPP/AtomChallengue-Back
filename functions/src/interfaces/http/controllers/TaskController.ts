import { Response } from 'express';
import { CreateTaskUseCase } from '../../../application/use-cases/CreateTaskUseCase';
import { ListTasksUseCase } from '../../../application/use-cases/ListTasksUseCase';
import { UpdateTaskUseCase } from '../../../application/use-cases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../../application/use-cases/DeleteTaskUseCase';
import { CreateTaskDTO } from '../../../application/dto/CreateTaskDTO';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { TaskStatus } from '../../../domain/enums/TaskStatus';

export class TaskController {
    constructor(
        private readonly createTaskUseCase: CreateTaskUseCase,
        private readonly listTasksUseCase: ListTasksUseCase,
        private readonly updateTaskUseCase: UpdateTaskUseCase,
        private readonly deleteTaskUseCase: DeleteTaskUseCase
    ) {}

    async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const dto = req.body as CreateTaskDTO;
            const userId = req.user!.userId;
      
            const task = await this.createTaskUseCase.execute(dto, userId);
      
            res.status(201).json({
                status: 'success',
                data: task
            });
        } catch (error) {
            console.error('Error en createTask:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al crear tarea',
                code: 500
            });
        }
    }

    async listTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const { status, orderBy, direction } = req.query;
      
            const options = {
                ...(status && { status: status as TaskStatus }),
                ...(orderBy && { orderBy: orderBy as 'createdAt' | 'updatedAt' | 'title' }),
                ...(direction && { direction: direction as 'asc' | 'desc' })
            };
      
            const tasks = await this.listTasksUseCase.execute(userId, options);
      
            res.status(200).json({
                status: 'success',
                data: tasks
            });
        } catch (error) {
            console.error('Error en listTasks:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al listar tareas',
                code: 500
            });
        }
    }

    async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const dto = req.body;
            const userId = req.user!.userId;
      
            console.log('UpdateTask - Body recibido:', req.body);
            console.log('UpdateTask - DTO después de validación:', dto);
      
            const task = await this.updateTaskUseCase.execute(id, userId, dto);
      
            res.status(200).json({
                status: 'success',
                data: task
            });
        } catch (error) {
            console.error('Error en updateTask:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al actualizar tarea',
                code: 500
            });
        }
    }

    async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;
      
            await this.deleteTaskUseCase.execute(id, userId);
      
            res.status(204).send();
        } catch (error) {
            console.error('Error en deleteTask:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al eliminar tarea',
                code: 500
            });
        }
    }
} 
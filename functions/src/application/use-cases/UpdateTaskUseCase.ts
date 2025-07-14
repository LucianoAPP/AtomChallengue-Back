import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { UpdateTaskDTO } from '../dto/UpdateTaskDTO';
import { TaskResponseDTO } from '../dto/TaskResponseDTO';
import { NotFoundError, AuthorizationError } from '../../shared/errors/DomainError';

@injectable()
export class UpdateTaskUseCase {
    constructor(
        @inject('ITaskRepository')
        private taskRepository: ITaskRepository
    ) {}

    async execute(taskId: string, userId: string, dto: UpdateTaskDTO): Promise<TaskResponseDTO> {
        const task = await this.taskRepository.findById(taskId);
    
        if (!task) {
            throw new NotFoundError('Tarea', taskId);
        }

        // Verificar que la tarea pertenece al usuario
        if (task.getUserId().toString() !== userId) {
            throw new AuthorizationError('No tienes permisos para actualizar esta tarea');
        }

        // Actualizar la tarea usando métodos de la entidad
        if (dto.title !== undefined) {
            task.updateTitle(dto.title);
        }
        
        if (dto.description !== undefined) {
            task.updateDescription(dto.description);
        }
        
        if (dto.status !== undefined) {
            task.updateStatus(dto.status);
        }

        const updatedTask = await this.taskRepository.update(task);
        return TaskResponseDTO.fromTask(updatedTask);
    }
} 
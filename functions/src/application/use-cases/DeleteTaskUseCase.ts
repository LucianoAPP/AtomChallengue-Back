import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { NotFoundError, AuthorizationError } from '../../shared/errors/DomainError';

@injectable()
export class DeleteTaskUseCase {
    constructor(
        @inject('ITaskRepository')
        private taskRepository: ITaskRepository
    ) {}

    async execute(taskId: string, userId: string): Promise<void> {
        const task = await this.taskRepository.findById(taskId);
    
        if (!task) {
            throw new NotFoundError('Tarea', taskId);
        }

        // Verificar que la tarea pertenece al usuario
        if (task.getUserId().toString() !== userId) {
            throw new AuthorizationError('No tienes permisos para eliminar esta tarea');
        }

        await this.taskRepository.delete(taskId);
    }
} 
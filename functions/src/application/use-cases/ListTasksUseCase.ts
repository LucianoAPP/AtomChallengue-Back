import { inject, injectable } from 'tsyringe';
import { ITaskRepository, FindAllOptions } from '../../domain/repositories/ITaskRepository';
import { TaskResponseDTO } from '../dto/TaskResponseDTO';

@injectable()
export class ListTasksUseCase {
    constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
    ) {}

    async execute(userId: string, options?: FindAllOptions): Promise<TaskResponseDTO[]> {
        const tasks = await this.taskRepository.findAllByUser(userId, {
            orderBy: 'createdAt',
            direction: 'desc',
            ...options
        });

        return tasks.map(task => TaskResponseDTO.fromTask(task));
    }
} 
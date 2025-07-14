import { inject, injectable } from 'tsyringe';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Task } from '../../domain/entities/Task';
import { CreateTaskDTO } from '../dto/CreateTaskDTO';
import { TaskResponseDTO } from '../dto/TaskResponseDTO';

@injectable()
export class CreateTaskUseCase {
    constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
    ) {}

    async execute(dto: CreateTaskDTO, userId: string): Promise<TaskResponseDTO> {
        const task = Task.create(
            userId,
            dto.title,
            dto.description || ''
        );

        const savedTask = await this.taskRepository.create(task);
        return TaskResponseDTO.fromTask(savedTask);
    }
} 
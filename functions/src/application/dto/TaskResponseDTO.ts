import { TaskStatus } from '../../domain/enums/TaskStatus';

export class TaskResponseDTO {
    constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: TaskStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
    ) {}

    static fromTask(task: any): TaskResponseDTO {
        return new TaskResponseDTO(
            task.getId().toString(),
            task.getUserId().toString(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }
} 
import { TaskId } from '../value-objects/TaskId';
import { UserId } from '../value-objects/UserId';
import { TaskStatus } from '../enums/TaskStatus';

export class Task {
    constructor(
    private readonly id: TaskId,
    private readonly userId: UserId,
    private title: string,
    private description: string,
    private status: TaskStatus,
    private readonly createdAt: Date,
    private updatedAt: Date
    ) {}

    static create(
        userId: string,
        title: string,
        description: string
    ): Task {
        return new Task(
            new TaskId(),
            new UserId(userId),
            title,
            description,
            TaskStatus.PENDING,
            new Date(),
            new Date()
        );
    }

    static fromPrimitives(data: {
    id: string;
    userId: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
  }): Task {
        return new Task(
            new TaskId(data.id),
            new UserId(data.userId),
            data.title,
            data.description,
            data.status,
            data.createdAt,
            data.updatedAt
        );
    }

    getId(): TaskId {
        return this.id;
    }

    getUserId(): UserId {
        return this.userId;
    }

    getTitle(): string {
        return this.title;
    }

    getDescription(): string {
        return this.description;
    }

    getStatus(): TaskStatus {
        return this.status;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    updateTitle(title: string): void {
        this.title = title;
        this.updatedAt = new Date();
    }

    updateDescription(description: string): void {
        this.description = description;
        this.updatedAt = new Date();
    }

    updateStatus(status: TaskStatus): void {
        this.status = status;
        this.updatedAt = new Date();
    }

    complete(): void {
        this.status = TaskStatus.COMPLETED;
        this.updatedAt = new Date();
    }

    markAsPending(): void {
        this.status = TaskStatus.PENDING;
        this.updatedAt = new Date();
    }

    isCompleted(): boolean {
        return this.status === TaskStatus.COMPLETED;
    }

    toPrimitives() {
        return {
            id: this.id.toString(),
            userId: this.userId.toString(),
            title: this.title,
            description: this.description,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
} 
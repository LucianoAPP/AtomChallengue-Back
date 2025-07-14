import { Task } from '../entities/Task';

export interface FindAllOptions {
  status?: string;
  orderBy?: 'createdAt' | 'updatedAt' | 'title';
  direction?: 'asc' | 'desc';
}

export interface ITaskRepository {
  findById(id: string): Promise<Task | null>;
  findAllByUser(userId: string, options?: FindAllOptions): Promise<Task[]>;
  create(task: Task): Promise<Task>;
  update(task: Task): Promise<Task>;
  delete(id: string): Promise<void>;
} 
import { injectable } from 'tsyringe';
import { ITaskRepository, FindAllOptions } from '../../domain/repositories/ITaskRepository';
import { Task } from '../../domain/entities/Task';
import { db } from '../config/firebase';

@injectable()
export class FirestoreTaskRepository implements ITaskRepository {
    private readonly collection = 'tasks';

    async findById(id: string): Promise<Task | null> {
        try {
            const doc = await db.collection(this.collection).doc(id).get();
      
            if (!doc.exists) {
                return null;
            }

            const data = doc.data()!;
            return Task.fromPrimitives({
                id: doc.id,
                userId: data.userId,
                title: data.title,
                description: data.description,
                status: data.status,
                createdAt: data.createdAt.toDate(),
                updatedAt: data.updatedAt.toDate()
            });
        } catch (error) {
            console.error('Error al buscar tarea por ID:', error);
            throw error;
        }
    }

    async findAllByUser(userId: string, options?: FindAllOptions): Promise<Task[]> {
        try {
            let query = db.collection(this.collection).where('userId', '==', userId);

            // Aplicar filtros
            if (options?.status) {
                query = query.where('status', '==', options.status);
            }

            // Aplicar ordenamiento
            if (options?.orderBy) {
                query = query.orderBy(options.orderBy, options.direction || 'desc');
            } else {
                query = query.orderBy('createdAt', 'desc');
            }

            const snapshot = await query.get();
            const tasks: Task[] = [];

            snapshot.forEach(doc => {
                const data = doc.data();
                const task = Task.fromPrimitives({
                    id: doc.id,
                    userId: data.userId,
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    createdAt: data.createdAt.toDate(),
                    updatedAt: data.updatedAt.toDate()
                });
                tasks.push(task);
            });

            return tasks;
        } catch (error) {
            console.error('Error al buscar tareas por usuario:', error);
            throw error;
        }
    }

    async create(task: Task): Promise<Task> {
        try {
            const taskData = task.toPrimitives();
            const docRef = await db.collection(this.collection).add({
                ...taskData,
                createdAt: new Date(taskData.createdAt),
                updatedAt: new Date(taskData.updatedAt)
            });

            return Task.fromPrimitives({
                id: docRef.id,
                userId: taskData.userId,
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                createdAt: taskData.createdAt,
                updatedAt: taskData.updatedAt
            });
        } catch (error) {
            console.error('Error al crear tarea:', error);
            throw error;
        }
    }

    async update(task: Task): Promise<Task> {
        try {
            const taskData = task.toPrimitives();
            await db.collection(this.collection).doc(taskData.id).update({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                updatedAt: new Date(taskData.updatedAt)
            });

            return task;
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
            throw error;
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await db.collection(this.collection).doc(id).delete();
        } catch (error) {
            console.error('Error al eliminar tarea:', error);
            throw error;
        }
    }
} 
import { injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { db } from '../config/firebase';

@injectable()
export class FirestoreUserRepository implements IUserRepository {
    private readonly collection = 'users';

    async findByEmail(email: string): Promise<User | null> {
        try {
            const snapshot = await db
                .collection(this.collection)
                .where('email', '==', email)
                .limit(1)
                .get();

            if (snapshot.empty) {
                return null;
            }

            const doc = snapshot.docs[0];
            const data = doc.data();
      
            return User.fromPrimitives({
                id: doc.id,
                email: data.email,
                createdAt: data.createdAt.toDate()
            });
        } catch (error) {
            console.error('Error al buscar usuario por email:', error);
            throw error;
        }
    }

    async create(user: User): Promise<User> {
        try {
            const userData = user.toPrimitives();
            const docRef = await db.collection(this.collection).add({
                ...userData,
                createdAt: new Date(userData.createdAt)
            });

            return User.fromPrimitives({
                id: docRef.id,
                email: userData.email,
                createdAt: userData.createdAt
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error;
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            const doc = await db.collection(this.collection).doc(id).get();
      
            if (!doc.exists) {
                return null;
            }

            const data = doc.data()!;
            return User.fromPrimitives({
                id: doc.id,
                email: data.email,
                createdAt: data.createdAt.toDate()
            });
        } catch (error) {
            console.error('Error al buscar usuario por ID:', error);
            throw error;
        }
    }
} 
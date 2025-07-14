import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';

export class User {
    constructor(
        private readonly id: UserId,
        private readonly email: Email,
        private readonly createdAt: Date
    ) {}

    static create(email: string): User {
        return new User(
            new UserId(),
            new Email(email),
            new Date()
        );
    }

    static fromPrimitives(data: {
        id: string;
        email: string;
        createdAt: Date;
    }): User {
        return new User(
            new UserId(data.id),
            new Email(data.email),
            data.createdAt
        );
    }

    getId(): UserId {
        return this.id;
    }

    getEmail(): Email {
        return this.email;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    toPrimitives() {
        return {
            id: this.id.toString(),
            email: this.email.toString(),
            createdAt: this.createdAt
        };
    }
} 
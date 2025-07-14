import { User } from '../../domain/entities/User';

export class UserResponseDTO {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly createdAt: Date
    ) {}

    static fromUser(user: User): UserResponseDTO {
        return new UserResponseDTO(
            user.getId().toString(),
            user.getEmail().toString(),
            user.getCreatedAt()
        );
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            createdAt: this.createdAt
        };
    }
} 
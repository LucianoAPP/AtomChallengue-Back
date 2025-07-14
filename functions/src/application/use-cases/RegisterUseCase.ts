import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ITokenGenerator } from '../../domain/services/ITokenGenerator';
import { RegisterDTO } from '../dto/RegisterDTO';
import { UserResponseDTO } from '../dto/UserResponseDTO';
import { User } from '../../domain/entities/User';
import { ConflictError } from '../../shared/errors/DomainError';

export interface RegisterResult {
  token: string;
  user: UserResponseDTO;
}

@injectable()
export class RegisterUseCase {
    constructor(
        @inject('IUserRepository')
        private userRepository: IUserRepository,
        @inject('ITokenGenerator')
        private tokenGenerator: ITokenGenerator
    ) {}

    async execute(dto: RegisterDTO): Promise<RegisterResult> {
        // Verificar si el usuario ya existe
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictError('El usuario ya existe');
        }

        // Crear nuevo usuario
        const user = User.create(dto.email);
        const savedUser = await this.userRepository.create(user);

        const token = this.tokenGenerator.generateToken({
            userId: savedUser.getId().toString(),
            email: savedUser.getEmail().toString()
        });

        return {
            token,
            user: UserResponseDTO.fromUser(savedUser)
        };
    }
} 
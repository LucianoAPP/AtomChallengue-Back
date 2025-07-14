import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { CreateUserDTO } from '../dto/CreateUserDTO';
import { UserResponseDTO } from '../dto/UserResponseDTO';

@injectable()
export class CreateUserUseCase {
    constructor(
    @inject('IUserRepository')
    private userRepository: IUserRepository
    ) {}

    async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // Buscar si el usuario ya existe
        const existingUser = await this.userRepository.findByEmail(dto.email);
    
        if (existingUser) {
            return UserResponseDTO.fromUser(existingUser);
        }

        // Crear nuevo usuario
        const user = User.create(dto.email);
        const savedUser = await this.userRepository.create(user);
    
        return UserResponseDTO.fromUser(savedUser);
    }
} 
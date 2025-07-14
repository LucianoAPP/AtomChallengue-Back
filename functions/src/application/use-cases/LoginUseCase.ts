import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { ITokenGenerator } from '../../domain/services/ITokenGenerator';
import { LoginDTO } from '../dto/LoginDTO';
import { UserResponseDTO } from '../dto/UserResponseDTO';

export interface LoginResult {
  status: 'ok' | 'not_found';
  token?: string;
  user?: UserResponseDTO;
}

@injectable()
export class LoginUseCase {
    constructor(
        @inject('IUserRepository')
        private userRepository: IUserRepository,
        @inject('ITokenGenerator')
        private tokenGenerator: ITokenGenerator
    ) {}

    async execute(dto: LoginDTO): Promise<LoginResult> {
        // Buscar usuario por email
        const user = await this.userRepository.findByEmail(dto.email);
    
        if (!user) {
            return { status: 'not_found' };
        }

        const token = this.tokenGenerator.generateToken({
            userId: user.getId().toString(),
            email: user.getEmail().toString()
        });

        return {
            status: 'ok',
            token,
            user: UserResponseDTO.fromUser(user)
        };
    }
} 
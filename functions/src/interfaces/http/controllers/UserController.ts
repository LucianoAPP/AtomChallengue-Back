import { Request, Response } from 'express';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { CreateUserDTO } from '../../../application/dto/CreateUserDTO';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserResponseDTO } from '../../../application/dto/UserResponseDTO';

export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly userRepository: IUserRepository
    ) {}

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const dto = req.body as CreateUserDTO;
      
            const user = await this.createUserUseCase.execute(dto);
      
            res.status(201).json({
                status: 'success',
                data: user
            });
        } catch (error) {
            console.error('Error en createUser:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al crear usuario',
                code: 500
            });
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.query;
      
            if (!email || typeof email !== 'string') {
                res.status(400).json({
                    status: 'error',
                    message: 'Email es requerido',
                    code: 400
                });
                return;
            }

            const user = await this.userRepository.findByEmail(email);
      
            if (!user) {
                res.status(200).json({
                    status: 'not_found',
                    message: 'Usuario no encontrado',
                    code: 200
                });
                return;
            }
      
            res.status(200).json({
                status: 'success',
                data: UserResponseDTO.fromUser(user)
            });
        } catch (error) {
            console.error('Error en getUserByEmail:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error al obtener usuario',
                code: 500
            });
        }
    }
} 
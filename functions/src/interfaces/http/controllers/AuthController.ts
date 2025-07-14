import { Request, Response } from 'express';
import { LoginUseCase } from '../../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../../application/use-cases/RegisterUseCase';
import { LoginDTO } from '../../../application/dto/LoginDTO';
import { RegisterDTO } from '../../../application/dto/RegisterDTO';

export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase
    ) {}

    async login(req: Request, res: Response): Promise<void> {
        try {
            const dto = req.body as LoginDTO;
      
            const result = await this.loginUseCase.execute(dto);
      
            if (result.status === 'not_found') {
                res.status(404).json({
                    status: 'not_found',
                    message: 'Usuario no encontrado'
                });
                return;
            }
      
            res.status(200).json({
                status: 'ok',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error en el inicio de sesión',
                code: 500
            });
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const dto = req.body as RegisterDTO;
            const result = await this.registerUseCase.execute(dto);
      
            res.status(201).json({
                status: 'created',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            console.error('Error en register:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error en el registro',
                code: 500
            });
        }
    }
} 
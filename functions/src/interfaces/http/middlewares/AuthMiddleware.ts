import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ITokenGenerator } from '../../../domain/services/ITokenGenerator';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email?: string;
    };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'error',
                message: 'Token de autorización requerido',
                code: 401
            });
            return;
        }

        const token = authHeader.substring(7);
        const tokenGenerator = container.resolve<ITokenGenerator>('ITokenGenerator');
        
        try {
            const payload = tokenGenerator.verifyToken(token);
            
            req.user = {
                userId: payload.userId,
                email: payload.email
            };
            
            next();
        } catch (error) {
            res.status(401).json({
                status: 'error',
                message: 'Token inválido o expirado',
                code: 401
            });
        }
    } catch (error) {
        console.error('Error en authMiddleware:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error en la autenticación',
            code: 500
        });
    }
}; 
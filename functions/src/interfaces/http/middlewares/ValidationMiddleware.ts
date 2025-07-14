import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export function validationMiddleware(dtoClass: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('ValidationMiddleware - Body original:', req.body);
            const dtoObject = plainToClass(dtoClass, req.body);
            console.log('ValidationMiddleware - DTO transformado:', dtoObject);
            const errors = await validate(dtoObject, { 
                whitelist: true, 
                forbidNonWhitelisted: true 
            });
            console.log('ValidationMiddleware - Errores de validación:', errors);

            if (errors.length > 0) {
                const validationErrors = errors.map(error => ({
                    property: error.property,
                    constraints: error.constraints
                }));

                console.log('ValidationMiddleware - Rechazando request con errores:', validationErrors);
                return res.status(400).json({
                    status: 'error',
                    message: 'Error de validación',
                    errors: validationErrors
                });
            }

            req.body = dtoObject;
            console.log('ValidationMiddleware - Request validado, continuando...');
            next();
            return;
        } catch (error) {
            console.error('ValidationMiddleware - Error en validación:', error);
            return res.status(400).json({
                status: 'error',
                message: 'Error en la validación de datos'
            });
        }
    };
} 
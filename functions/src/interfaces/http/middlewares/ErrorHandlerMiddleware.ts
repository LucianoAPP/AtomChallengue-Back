import { Request, Response } from 'express';
import { DomainError } from '../../../shared/errors/DomainError';
import { container } from 'tsyringe';
import { ILogger } from '../../../domain/services/ILogger';

export const errorHandlerMiddleware = (
    error: Error,
    req: Request,
    res: Response
): void => {
    const logger = container.resolve<ILogger>('ILogger');

    // Log del error
    logger.error('Error en la aplicación', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });

    // Manejar errores del dominio
    if (error instanceof DomainError) {
        res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
            code: error.code,
            timestamp: new Date().toISOString()
        });
        return;
    }

    // Manejar errores de validación de class-validator
    if (error.name === 'ValidationError') {
        res.status(400).json({
            status: 'error',
            message: 'Error de validación',
            code: 'VALIDATION_ERROR',
            details: error.message,
            timestamp: new Date().toISOString()
        });
        return;
    }

    // Error interno del servidor (por defecto)
    res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString()
    });
}; 
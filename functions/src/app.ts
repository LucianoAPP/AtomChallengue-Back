import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createRoutes } from './interfaces/http/routes';
import { errorHandlerMiddleware } from './interfaces/http/middlewares/ErrorHandlerMiddleware';
import './infrastructure/config/container';

export function createApp(): express.Application {
    const app = express();

    // Middlewares
    app.use(helmet());
    app.use(compression());
    app.use(cors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
        credentials: true
    }));

    // Middlewares de parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Rutas
    app.use(createRoutes());

    // Middleware de manejo de errores
    app.use(errorHandlerMiddleware);

    return app;
} 
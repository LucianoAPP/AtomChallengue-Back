import 'reflect-metadata';
import { setGlobalOptions } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';
import { createApp } from './app';

// Configuración global de Firebase Functions
setGlobalOptions({ 
    maxInstances: 10,
    region: 'us-central1'
});

// Crear la aplicación Express
const app = createApp();

// Exportar la función HTTP
export const api = onRequest({
    cors: true,
    maxInstances: 10
}, app);

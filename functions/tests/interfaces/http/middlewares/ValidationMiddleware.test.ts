import request from 'supertest';
import express from 'express';
import { validationMiddleware } from '../../../../src/interfaces/http/middlewares/ValidationMiddleware';
import { UpdateTaskDTO } from '../../../../src/application/dto/UpdateTaskDTO';

describe('ValidationMiddleware', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Ruta de prueba con middleware de validación
    app.put('/test', 
      validationMiddleware(UpdateTaskDTO),
      (req, res) => {
        res.json({ 
          status: 'success', 
          data: req.body 
        });
      }
    );
  });

  describe('UpdateTaskDTO validation', () => {
    it('should reject invalid completed field', async () => {
      const response = await request(app)
        .put('/test')
        .send({ completed: true })
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Error de validación',
        errors: expect.arrayContaining([
          expect.objectContaining({
            property: 'completed',
            constraints: expect.any(Object)
          })
        ])
      });
    });

    it('should accept valid status field', async () => {
      const response = await request(app)
        .put('/test')
        .send({ status: 'COMPLETED' })
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: { status: 'COMPLETED' }
      });
    });

    it('should accept valid title field', async () => {
      const response = await request(app)
        .put('/test')
        .send({ title: 'Nueva tarea' })
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: { title: 'Nueva tarea' }
      });
    });

    it('should accept valid description field', async () => {
      const response = await request(app)
        .put('/test')
        .send({ description: 'Descripción de la tarea' })
        .expect(200);

      expect(response.body).toEqual({
        status: 'success',
        data: { description: 'Descripción de la tarea' }
      });
    });

    it('should reject invalid status value', async () => {
      const response = await request(app)
        .put('/test')
        .send({ status: 'INVALID_STATUS' })
        .expect(400);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Error de validación',
        errors: expect.arrayContaining([
          expect.objectContaining({
            property: 'status',
            constraints: expect.any(Object)
          })
        ])
      });
    });
  });
}); 
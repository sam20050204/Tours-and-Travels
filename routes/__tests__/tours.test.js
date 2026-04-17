import request from 'supertest';
import app from '../app';

describe('Tours API', () => {
    it('should return a list of tours', async () => {
        const response = await request(app).get('/api/tours');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create a new tour', async () => {
        const newTour = { name: 'New Tour', price: 100 };
        const response = await request(app).post('/api/tours').send(newTour);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newTour.name);
    });
});
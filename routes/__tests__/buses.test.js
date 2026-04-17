import request from 'supertest';
import app from '../../app';

describe('Buses API', () => {
    it('should return a list of buses', async () => {
        const response = await request(app).get('/api/buses');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create a new bus', async () => {
        const newBus = { name: 'Bus 1', capacity: 50 };
        const response = await request(app).post('/api/buses').send(newBus);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newBus.name);
    });
});
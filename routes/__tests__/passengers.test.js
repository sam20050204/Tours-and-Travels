const request = require('supertest');
const app = require('../../app');

describe('Passengers Route', () => {
    it('should return a list of passengers', async () => {
        const response = await request(app).get('/api/passengers');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should create a new passenger', async () => {
        const newPassenger = { name: 'John Doe', age: 30 };
        const response = await request(app).post('/api/passengers').send(newPassenger);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe(newPassenger.name);
    });
});
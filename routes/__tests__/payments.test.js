const request = require('supertest');
const app = require('../../app');

describe('Payments Route', () => {
	test('should create a payment', async () => {
		const response = await request(app)
			.post('/payments')
			.send({ amount: 100, method: 'credit_card' });
		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('id');
	});

	test('should return 400 for invalid payment', async () => {
		const response = await request(app)
			.post('/payments')
			.send({ amount: -50, method: 'credit_card' });
		expect(response.statusCode).toBe(400);
	});
});
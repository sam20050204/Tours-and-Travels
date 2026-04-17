const Payment = require('../Payment');

test('Payment model should calculate total correctly', () => {
	const payment = new Payment(100, 0.1);
	expect(payment.calculateTotal()).toBe(110);
});
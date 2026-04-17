const Bus = require('../Bus');

test('Bus model should create a new bus instance', () => {
    const bus = new Bus('Bus 101', 50);
    expect(bus.name).toBe('Bus 101');
    expect(bus.capacity).toBe(50);
});

test('Bus model should return correct bus details', () => {
    const bus = new Bus('Bus 102', 40);
    expect(bus.getDetails()).toBe('Bus 102 has a capacity of 40.');
});
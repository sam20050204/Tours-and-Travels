const { render, screen } = require('@testing-library/react');
const TourManagement = require('../TourManagement');

test('renders TourManagement component', () => {
	render(<TourManagement />);
	const linkElement = screen.getByText(/Tour Management/i);
	expect(linkElement).toBeInTheDocument();
});
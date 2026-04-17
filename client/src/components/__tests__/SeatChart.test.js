const { render, screen } = require('@testing-library/react');
const SeatChart = require('../SeatChart');

test('renders seat chart', () => {
    render(<SeatChart />);
    const linkElement = screen.getByText(/seat chart/i);
    expect(linkElement).toBeInTheDocument();
});

test('allows seat selection', () => {
    render(<SeatChart />);
    const seatElement = screen.getByTestId('seat-1');
    seatElement.click();
    expect(seatElement).toHaveClass('selected');
});
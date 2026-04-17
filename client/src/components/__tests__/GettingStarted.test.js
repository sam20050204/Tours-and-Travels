const { render, screen } = require('@testing-library/react');
const GettingStarted = require('../GettingStarted');

test('renders GettingStarted component', () => {
    render(<GettingStarted />);
    const linkElement = screen.getByText(/Getting Started/i);
    expect(linkElement).toBeInTheDocument();
});
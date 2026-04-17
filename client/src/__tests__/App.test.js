import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders main application component', () => {
    render(<App />);
    const linkElement = screen.getByText(/your main application text/i);
    expect(linkElement).toBeInTheDocument();
});

test('checks button functionality', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button', { name: /your button text/i });
    expect(buttonElement).toBeEnabled();
});
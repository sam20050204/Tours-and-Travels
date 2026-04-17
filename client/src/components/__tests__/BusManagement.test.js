import React from 'react';
import { render, screen } from '@testing-library/react';
import BusManagement from '../BusManagement';

test('renders BusManagement component', () => {
    render(<BusManagement />);
    const linkElement = screen.getByText(/Bus Management/i);
    expect(linkElement).toBeInTheDocument();
});

test('checks functionality of bus addition', () => {
    render(<BusManagement />);
    // Add your test logic here
});

test('checks functionality of bus deletion', () => {
    render(<BusManagement />);
    // Add your test logic here
});
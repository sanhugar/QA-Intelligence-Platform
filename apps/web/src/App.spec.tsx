import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App (web host)', () => {
  it('renders the bootstrap shell', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'ATI Platform' })).toBeInTheDocument();
    expect(screen.getByTestId('host-status')).toHaveTextContent('Web host ready');
  });
});

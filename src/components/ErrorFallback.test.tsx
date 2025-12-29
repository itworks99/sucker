import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {ErrorFallback} from './ErrorFallback';

describe('ErrorFallback', () => {
  const mockError = new Error('Test error message');
  const mockResetErrorBoundary = vi.fn();

  it('renders error message', () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('An error occurred while rendering the application.')).toBeTruthy();
  });

  it('displays error details', () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />);
    expect(screen.getByText('Error details')).toBeTruthy();
    expect(screen.getByText(/Test error message/)).toBeTruthy();
  });

  it('renders reload button', () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />);
    expect(screen.getByRole('button', {name: /Reload Application/})).toBeTruthy();
  });

  it('renders clickable reload button', () => {
    const resetErrorBoundary = vi.fn();
    render(<ErrorFallback error={mockError} resetErrorBoundary={resetErrorBoundary} />);
    const button = screen.getByRole('button', {name: /Reload Application/});
    expect(button).toBeTruthy();
  });

  it('displays different error messages', () => {
    const differentError = new Error('Different error');
    render(<ErrorFallback error={differentError} resetErrorBoundary={mockResetErrorBoundary} />);
    expect(screen.getByText(/Different error/)).toBeTruthy();
  });

  it('renders warning icon', () => {
    render(<ErrorFallback error={mockError} resetErrorBoundary={mockResetErrorBoundary} />);
    const icon = screen.getByText('Something went wrong').querySelector('i.warning.sign.icon');
    expect(icon).toBeTruthy();
  });
});

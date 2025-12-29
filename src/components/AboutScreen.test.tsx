import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import {AboutScreen} from './AboutScreen';

describe('AboutScreen', () => {
  it('renders when active', () => {
    render(<AboutScreen active={true} version="1.0.0" onClose={() => {}} />);
    expect(screen.getByText('Sucker')).toBeTruthy();
    expect(screen.getByText(/version 1.0.0/)).toBeTruthy();
  });

  it('does not render when inactive', () => {
    render(<AboutScreen active={false} version="1.0.0" onClose={() => {}} />);
    expect(screen.queryByText('Sucker')).toBeFalsy();
  });

  it('displays version information', () => {
    render(<AboutScreen active={true} version="2.5.3" onClose={() => {}} />);
    expect(screen.getByText(/version 2.5.3/)).toBeTruthy();
  });

  it('displays github link', () => {
    render(<AboutScreen active={true} version="1.0.0" onClose={() => {}} />);
    const githubLink = screen.getByRole('link', {name: /itworks99\/sucker/});
    expect(githubLink.getAttribute('href')).toBe('https://github.com/itworks99/sucker');
  });

  it('displays squid link', () => {
    render(<AboutScreen active={true} version="1.0.0" onClose={() => {}} />);
    const squidLink = screen.getByRole('link', {name: /Squid/});
    expect(squidLink.getAttribute('href')).toBe('http://www.squid-cache.org/');
  });

  it('renders dimmer component', () => {
    render(<AboutScreen active={true} version="1.0.0" onClose={() => {}} />);
    const dimmer = screen.getByText('Sucker').closest('.dimmer');
    expect(dimmer).toBeTruthy();
  });

  it('displays technology stack', () => {
    render(<AboutScreen active={true} version="1.0.0" onClose={() => {}} />);
    expect(screen.getByText(/Built with Bottle, Gunicorn, Python, React and Semantic-UI/)).toBeTruthy();
  });

  it('displays created in Sydney message', () => {
    render(<AboutScreen active={true} version="1.0.0" onClose={() => {}} />);
    expect(screen.getByText(/Created in Sydney with/)).toBeTruthy();
  });
});

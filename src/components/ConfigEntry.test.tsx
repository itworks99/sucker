import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {ConfigEntry} from './ConfigEntry';
import React from 'react';

describe('ConfigEntry', () => {
  const defaultProps = {
    entryNumber: 0,
    tag: 'http_port',
    value: '3128',
    isEnabled: true,
    switchable: 0,
    switchPosition: 0,
    unit: '',
    messageBuilt: '',
    messageWarning: '',
    isActive: false,
    componentRef: React.createRef(),
    onToggle: vi.fn(),
    onValueChange: vi.fn(),
    onFocus: vi.fn(),
    onHelpClick: vi.fn(),
    onMultilineClick: vi.fn(),
  };

  it('renders checkbox for toggling', () => {
    const {container} = render(<ConfigEntry {...defaultProps} />);
    const checkbox = container.querySelector('.checkbox');
    expect(checkbox).toBeTruthy();
  });

  it('renders help button', () => {
    const {container} = render(<ConfigEntry {...defaultProps} />);
    const helpButton = container.querySelector('.help.icon');
    expect(helpButton).toBeTruthy();
  });

  it('renders text input for non-switchable entry', () => {
    const {container} = render(<ConfigEntry {...defaultProps} switchable={0} />);
    const input = container.querySelector('input[type="text"]');
    expect(input).toBeTruthy();
  });

  it('renders input with unit label', () => {
    render(<ConfigEntry {...defaultProps} unit="MB" />);
    expect(screen.getByText('MB')).toBeTruthy();
  });

  it('renders reset button for text input', () => {
    render(<ConfigEntry {...defaultProps} switchable={0} />);
    expect(screen.getByText('Reset')).toBeTruthy();
  });

  it('renders dropdown for switchable=1', () => {
    const {container} = render(<ConfigEntry {...defaultProps} switchable={1} />);
    const dropdown = container.querySelector('.dropdown');
    expect(dropdown).toBeTruthy();
  });

  it('renders multiline button for switchable=2', () => {
    render(<ConfigEntry {...defaultProps} switchable={2} tag="acl" />);
    expect(screen.getByText(/acl - Click to edit/)).toBeTruthy();
  });

  it('displays build warning when messageBuilt is provided', () => {
    const {container} = render(
      <ConfigEntry {...defaultProps} messageBuilt="--enable-ssl" />
    );
    const warningIcon = container.querySelector('.blue.icon');
    expect(warningIcon).toBeTruthy();
  });

  it('displays warning message when messageWarning is provided', () => {
    const {container} = render(
      <ConfigEntry {...defaultProps} messageWarning="This option is deprecated" />
    );
    const warningIcon = container.querySelector('.pink.icon');
    expect(warningIcon).toBeTruthy();
  });

  it('renders with active state', () => {
    const {container} = render(<ConfigEntry {...defaultProps} isActive={true} />);
    const row = container.querySelector('.active');
    expect(row).toBeTruthy();
  });

  it('renders with enabled checkbox', () => {
    const {container} = render(<ConfigEntry {...defaultProps} isEnabled={true} />);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeTruthy();
  });

  it('renders without warnings when messages are empty', () => {
    const {container} = render(
      <ConfigEntry {...defaultProps} messageBuilt="" messageWarning="" />
    );
    const warningIcons = container.querySelectorAll('.warning.sign.icon');
    expect(warningIcons.length).toBe(0);
  });

  it('renders input with default value', () => {
    const {container} = render(<ConfigEntry {...defaultProps} value="8080" />);
    const input = container.querySelector('input[type="text"]');
    expect(input?.defaultValue).toContain('8080');
  });

  it('renders all table cells', () => {
    const {container} = render(<ConfigEntry {...defaultProps} />);
    const cells = container.querySelectorAll('td');
    expect(cells.length).toBeGreaterThan(0);
  });
});

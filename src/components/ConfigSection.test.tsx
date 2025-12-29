import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import type {DataJSON} from '../types';
import {ConfigSection} from './ConfigSection';

describe('ConfigSection', () => {
  const mockDataJSON: DataJSON = {
    id: [0, 1, 2],
    tags: ['http_port', 'cache_dir', 'acl'],
    value: ['3128', '/var/spool/squid 100 16 256', 'localnet src 192.168.0.0/16'],
    is_enabled: [1, 1, 0],
    switchable: [0, 0, 2],
    switch_position: [0, 0, 0],
    section_number: [0, 0, 1],
    all_sections: ['Network Options', 'Access Controls'],
    available_versions: ['5.0'],
    squid_version: ['5.0'],
    units: ['', 'MB', ''],
    message_built: ['', '', ''],
    message_warning: ['', '', ''],
    help: ['Help for http_port', 'Help for cache_dir', 'Help for acl'],
  };

  const defaultProps = {
    dataJSON: mockDataJSON,
    sectionIndex: 0,
    activeAccordionIndex: 0,
    activeRowIndex: 0,
    componentRefs: {},
    onAccordionClick: vi.fn(),
    onToggleEntry: vi.fn(),
    onValueChange: vi.fn(),
    onFocusEntry: vi.fn(),
    onHelpClick: vi.fn(),
    onMultilineClick: vi.fn(),
  };

  it('renders section title', () => {
    render(<ConfigSection {...defaultProps} />);
    expect(screen.getByText('Network Options')).toBeTruthy();
  });

  it('renders entries for the section', () => {
    const {container} = render(<ConfigSection {...defaultProps} activeAccordionIndex={0} sectionIndex={0} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2); // http_port and cache_dir entries
  });

  it('renders correct number of entries for section', () => {
    const {container} = render(<ConfigSection {...defaultProps} activeAccordionIndex={0} sectionIndex={0} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2); // Only entries from section 0
  });

  it('renders section for different index', () => {
    render(<ConfigSection {...defaultProps} activeAccordionIndex={1} sectionIndex={1} />);
    expect(screen.getByText('Access Controls')).toBeTruthy();
    expect(screen.getByText(/Click to edit/)).toBeTruthy(); // Multiline button text
  });

  it('shows purple icon when section has enabled options', () => {
    const {container} = render(<ConfigSection {...defaultProps} sectionIndex={0} />);
    const purpleIcon = container.querySelector('.purple.icon');
    expect(purpleIcon).toBeTruthy();
  });

  it('shows default icon when section has no enabled options', () => {
    const {container} = render(<ConfigSection {...defaultProps} sectionIndex={1} />);
    const purpleIcon = container.querySelector('.purple.icon');
    expect(purpleIcon).toBeFalsy();
  });

  it('renders accordion title with dropdown icon', () => {
    const {container} = render(<ConfigSection {...defaultProps} />);
    const dropdownIcon = container.querySelector('.dropdown.icon');
    expect(dropdownIcon).toBeTruthy();
  });

  it('renders accordion content when active', () => {
    const {container} = render(
      <ConfigSection {...defaultProps} activeAccordionIndex={0} sectionIndex={0} />
    );
    const table = container.querySelector('table');
    expect(table).toBeTruthy();
  });

  it('does not show content when accordion is inactive', () => {
    const {container} = render(
      <ConfigSection {...defaultProps} activeAccordionIndex={1} sectionIndex={0} />
    );
    const activeContent = container.querySelector('.active.content');
    expect(activeContent).toBeFalsy();
  });

  it('renders tags icon', () => {
    const {container} = render(<ConfigSection {...defaultProps} />);
    const tagsIcon = container.querySelector('.tags.icon');
    expect(tagsIcon).toBeTruthy();
  });

  it('creates refs for each entry', () => {
    const componentRefs = {};
    render(<ConfigSection {...defaultProps} componentRefs={componentRefs} />);
    expect(Object.keys(componentRefs).length).toBeGreaterThan(0);
  });

  it('renders ConfigEntry components', () => {
    const {container} = render(<ConfigSection {...defaultProps} activeAccordionIndex={0} />);
    const checkboxes = container.querySelectorAll('.checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  it('highlights active row', () => {
    const {container} = render(
      <ConfigSection {...defaultProps} activeAccordionIndex={0} activeRowIndex={0} />
    );
    const activeRow = container.querySelector('tr.active');
    expect(activeRow).toBeTruthy();
  });

  it('renders table with correct number of entries', () => {
    const {container} = render(
      <ConfigSection {...defaultProps} activeAccordionIndex={0} sectionIndex={0} />
    );
    const tableBody = container.querySelector('tbody');
    expect(tableBody).toBeTruthy();
    const rows = tableBody?.querySelectorAll('tr');
    expect(rows?.length).toBe(2); // http_port and cache_dir
  });
});

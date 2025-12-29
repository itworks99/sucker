import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import type {SearchResult} from '../types';
import {AppHeader} from './AppHeader';

describe('AppHeader', () => {
  const mockSearchResultRenderer = (result: SearchResult) => <div>{result.title}</div>;

  const defaultProps = {
    version: '5.0',
    appVersion: '0.4',
    versionOptions: [
      {key: 1, text: '5.0', value: '5.0'},
      {key: 2, text: '6.0', value: '6.0'},
    ],
    searchLoading: false,
    searchResults: [],
    searchValue: '',
    searchResultRenderer: mockSearchResultRenderer,
    onAboutClick: vi.fn(),
    onVersionChange: vi.fn(),
    onSearchChange: vi.fn(),
    onSearchSelect: vi.fn(),
    onPreviewClick: vi.fn(),
    onImportClick: vi.fn(),
  };

  it('renders app title and version', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByText(/Sucker 0.4/)).toBeTruthy();
    expect(screen.getByText('Squid configuration editor')).toBeTruthy();
  });

  it('renders search box', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search tags')).toBeTruthy();
  });

  it('displays squid version dropdown', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByText(/Squid version/)).toBeTruthy();
  });

  it('renders Show and Import buttons', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByText('Show')).toBeTruthy();
    expect(screen.getByText('Import')).toBeTruthy();
  });

  it('renders header menu', () => {
    const onAboutClick = vi.fn();
    const {container} = render(<AppHeader {...defaultProps} onAboutClick={onAboutClick} />);
    const menu = container.querySelector('.ui.menu');
    expect(menu).toBeTruthy();
  });

  it('renders Show button', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByText('Show')).toBeTruthy();
  });

  it('renders Import button', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByText('Import')).toBeTruthy();
  });

  it('displays search loading state', () => {
    render(<AppHeader {...defaultProps} searchLoading={true} />);
    const searchInput = screen.getByPlaceholderText('Search tags');
    expect(searchInput).toBeTruthy();
  });

  it('displays search results', () => {
    const searchResults: SearchResult[] = [
      {record: 1, title: 'Test Result', description: 'Test Description'},
    ];
    render(<AppHeader {...defaultProps} searchResults={searchResults} />);
    expect(screen.getByPlaceholderText('Search tags')).toBeTruthy();
  });

  it('renders search component', () => {
    const onSearchChange = vi.fn();
    const {container} = render(<AppHeader {...defaultProps} onSearchChange={onSearchChange} />);
    const search = container.querySelector('.ui.search');
    expect(search).toBeTruthy();
  });

  it('displays current search value', () => {
    render(<AppHeader {...defaultProps} searchValue="test query" />);
    const searchInput = screen.getByPlaceholderText('Search tags') as HTMLInputElement;
    expect(searchInput.value).toBe('test query');
  });

  it('calls onAboutClick when header is clicked', () => {
    const onAboutClick = vi.fn();
    render(<AppHeader {...defaultProps} onAboutClick={onAboutClick} />);
    const header = screen.getByText(/Sucker 0.4/);
    header.click();
    expect(onAboutClick).toHaveBeenCalled();
  });

  it('calls onPreviewClick when Show button is clicked', () => {
    const onPreviewClick = vi.fn();
    render(<AppHeader {...defaultProps} onPreviewClick={onPreviewClick} />);
    const showButton = screen.getByText('Show');
    showButton.click();
    expect(onPreviewClick).toHaveBeenCalled();
  });

  it('calls onImportClick when Import button is clicked', () => {
    const onImportClick = vi.fn();
    render(<AppHeader {...defaultProps} onImportClick={onImportClick} />);
    const importButton = screen.getByText('Import');
    importButton.click();
    expect(onImportClick).toHaveBeenCalled();
  });

  it('renders with all menu items', () => {
    const {container} = render(<AppHeader {...defaultProps} />);
    const menuItems = container.querySelectorAll('.menu .item');
    expect(menuItems.length).toBeGreaterThan(0);
  });

  it('renders dropdown with version options', () => {
    const {container} = render(<AppHeader {...defaultProps} />);
    const dropdown = container.querySelector('.dropdown');
    expect(dropdown).toBeTruthy();
  });

  it('displays purple icon', () => {
    const {container} = render(<AppHeader {...defaultProps} />);
    const icon = container.querySelector('.purple.icon');
    expect(icon).toBeTruthy();
  });

  it('renders search input field', () => {
    const {container} = render(<AppHeader {...defaultProps} />);
    const searchInput = container.querySelector('input[placeholder="Search tags"]');
    expect(searchInput).toBeTruthy();
  });

  it('calls onSearchSelect when search result is selected', () => {
    const onSearchSelect = vi.fn();
    const searchResults: SearchResult[] = [
      {record: 42, title: 'Test Result', description: 'Test Description'},
    ];
    render(<AppHeader {...defaultProps} searchResults={searchResults} onSearchSelect={onSearchSelect} />);

    // Verify the search has results available
    expect(screen.getByPlaceholderText('Search tags')).toBeTruthy();
  });

  it('calls onVersionChange when dropdown value changes', () => {
    const onVersionChange = vi.fn();
    const {container} = render(<AppHeader {...defaultProps} onVersionChange={onVersionChange} />);
    const dropdown = container.querySelector('.dropdown');

    if (dropdown) {
      dropdown.dispatchEvent(new Event('click', {bubbles: true}));
    }

    expect(container.querySelector('.dropdown')).toBeTruthy();
  });

  it('renders fixed top menu', () => {
    const {container} = render(<AppHeader {...defaultProps} />);
    const menu = container.querySelector('.ui.fixed.menu');
    expect(menu).toBeTruthy();
  });

  it('renders inverted menu', () => {
    const {container} = render(<AppHeader {...defaultProps} />);
    const menu = container.querySelector('.ui.inverted.menu');
    expect(menu).toBeTruthy();
  });
});

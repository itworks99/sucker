import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createSearchResultRenderer } from './SearchResultRenderer';
import type { DataJSON, SearchResult } from '../types';

describe('SearchResultRenderer', () => {
  const mockDataJSON: DataJSON = {
    id: [0, 1, 2],
    tags: ['cache_dir', 'cache_mem', 'http_port'],
    value: ['cache_dir /var/spool/squid', 'cache_mem 256 MB', 'http_port 3128'],
    is_enabled: [1, 1, 1],
    switchable: [0, 0, 0],
    switch_position: [0, 0, 0],
    section_number: [0, 0, 1],
    all_sections: ['Memory Options', 'Network Options'],
    available_versions: ['3.5'],
    squid_version: ['3.5'],
    units: ['', 'MB', ''],
    message_built: ['', '', ''],
    message_warning: ['', '', ''],
    help: ['', '', ''],
  };

  it('should render search result with title and section', () => {
    const renderer = createSearchResultRenderer(mockDataJSON);
    const searchResult: SearchResult = {
      title: 'cache_dir',
      record: 0,
    };

    render(renderer(searchResult));

    expect(screen.getByText('cache_dir')).toBeTruthy();
    expect(screen.getByText('memory options')).toBeTruthy();
  });

  it('should render correct section for each record', () => {
    const renderer = createSearchResultRenderer(mockDataJSON);
    const searchResult: SearchResult = {
      title: 'http_port',
      record: 2,
    };

    render(renderer(searchResult));

    expect(screen.getByText('http_port')).toBeTruthy();
    expect(screen.getByText('network options')).toBeTruthy();
  });

  it('should convert section name to lowercase', () => {
    const renderer = createSearchResultRenderer(mockDataJSON);
    const searchResult: SearchResult = {
      title: 'cache_mem',
      record: 1,
    };

    render(renderer(searchResult));

    const subheader = screen.getByText('memory options');
    expect(subheader).toBeTruthy();
    expect(subheader.textContent).toBe('memory options');
  });

  it('should render with correct record key', () => {
    const renderer = createSearchResultRenderer(mockDataJSON);
    const searchResult: SearchResult = {
      title: 'test_option',
      record: 0,
    };

    const { container } = render(renderer(searchResult));
    const header = container.querySelector('.ui.header');

    expect(header).toBeTruthy();
    expect(screen.getByText('test_option')).toBeTruthy();
  });

  it('should handle multiple search results', () => {
    const renderer = createSearchResultRenderer(mockDataJSON);
    const results: SearchResult[] = [
      { title: 'cache_dir', record: 0 },
      { title: 'cache_mem', record: 1 },
      { title: 'http_port', record: 2 },
    ];

    const { container } = render(
      <>
        {results.map((result) => renderer(result))}
      </>
    );

    expect(screen.getByText('cache_dir')).toBeTruthy();
    expect(screen.getByText('cache_mem')).toBeTruthy();
    expect(screen.getByText('http_port')).toBeTruthy();
    expect(container.querySelectorAll('.ui.header')).toHaveLength(3);
  });
});

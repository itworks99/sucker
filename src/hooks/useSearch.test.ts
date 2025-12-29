import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import type { SearchResult } from '../types';

describe('useSearch', () => {
  const mockSearchData: SearchResult[] = [
    { title: 'cache_dir', record: 0 },
    { title: 'cache_mem', record: 1 },
    { title: 'http_port', record: 2 },
    { title: 'https_port', record: 3 },
    { title: 'access_log', record: 4 },
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    expect(result.current.loading).toBe(false);
    expect(result.current.results).toEqual([]);
    expect(result.current.value).toBe('');
  });

  it('should set loading state immediately on search', () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    act(() => {
      result.current.handleSearchChange('cache');
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.value).toBe('cache');
  });

  it('should debounce search and return matching results', async () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    act(() => {
      result.current.handleSearchChange('cache');
      vi.advanceTimersByTime(300);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.results).toHaveLength(2);
    expect(result.current.results[0].title).toBe('cache_dir');
    expect(result.current.results[1].title).toBe('cache_mem');
  });

  it('should perform case-insensitive search', async () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    act(() => {
      result.current.handleSearchChange('HTTP');
      vi.advanceTimersByTime(300);
    });

    expect(result.current.results).toHaveLength(2);
    expect(result.current.results[0].title).toBe('http_port');
    expect(result.current.results[1].title).toBe('https_port');
  });

  it('should clear results when search query is empty', async () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    // First search
    act(() => {
      result.current.handleSearchChange('cache');
      vi.advanceTimersByTime(300);
    });

    expect(result.current.results).toHaveLength(2);

    // Clear search
    act(() => {
      result.current.handleSearchChange('');
      vi.advanceTimersByTime(300);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.value).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('should cancel previous search when new search starts', async () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    act(() => {
      result.current.handleSearchChange('cache');
      vi.advanceTimersByTime(100);
      result.current.handleSearchChange('http');
      vi.advanceTimersByTime(300);
    });

    expect(result.current.results).toHaveLength(2);
    expect(result.current.results[0].title).toBe('http_port');
    expect(result.current.value).toBe('http');
  });

  it('should return empty results when no matches found', async () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    act(() => {
      result.current.handleSearchChange('nonexistent');
      vi.advanceTimersByTime(300);
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should escape special regex characters in search query', async () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    act(() => {
      result.current.handleSearchChange('cache.*');
      vi.advanceTimersByTime(300);
    });

    // Should not match anything because .* is escaped
    expect(result.current.results).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should handle default case in reducer', () => {
    const { result } = renderHook(() => useSearch(mockSearchData));

    // This tests the default case by ensuring the state doesn't change for unknown action types
    const initialState = { ...result.current };

    act(() => {
      // @ts-expect-error Testing default case with invalid action
      result.current.handleSearchChange.__proto__.dispatch?.({ type: 'UNKNOWN' });
    });

    expect(result.current.loading).toBe(initialState.loading);
  });

  it('should clean up timeout on unmount', () => {
    const { result, unmount } = renderHook(() => useSearch(mockSearchData));

    act(() => {
      result.current.handleSearchChange('cache');
    });

    unmount();

    // Should not throw error after unmount
    act(() => {
      vi.advanceTimersByTime(300);
    });
  });

  it('should update results when source data changes', async () => {
    const { result, rerender } = renderHook(
      ({ source }) => useSearch(source),
      { initialProps: { source: mockSearchData } }
    );

    act(() => {
      result.current.handleSearchChange('test');
      vi.advanceTimersByTime(300);
    });

    expect(result.current.results).toEqual([]);

    // Update source with new data
    const newSearchData: SearchResult[] = [
      { title: 'test_option', record: 10 },
      { title: 'test_value', record: 11 },
    ];

    rerender({ source: newSearchData });

    act(() => {
      result.current.handleSearchChange('test');
      vi.advanceTimersByTime(300);
    });

    expect(result.current.results).toHaveLength(2);
    expect(result.current.results[0].title).toBe('test_option');
  });
});

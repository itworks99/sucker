import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useSquidConfig } from './useSquidConfig';
import type { DataJSON } from '../types';

// Mock fetch globally
global.fetch = vi.fn();

const mockDataJSON: DataJSON = {
  id: [0, 1, 2],
  tags: ['tag1', 'tag2', 'tag3'],
  value: ['value1', 'value2', 'value3'],
  is_enabled: [1, 0, 1],
  switchable: [1, 1, 0],
  switch_position: [0, 1, 0],
  section_number: [1, 1, 2],
  all_sections: ['Section 1', 'Section 2'],
  available_versions: ['3.5', '4.0'],
  squid_version: ['3.5'],
  units: ['KB', 'MB', 'seconds'],
  message_built: ['Built message 1', 'Built message 2', 'Built message 3'],
  message_warning: ['Warning 1', 'Warning 2', 'Warning 3'],
  help: ['Help text 1', 'Help text 2', 'Help text 3'],
};

describe('useSquidConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    (global.fetch as any).mockResolvedValue({
      json: async () => mockDataJSON,
    });

    const { result } = renderHook(() => useSquidConfig());

    expect(result.current.dataJSON).toBeNull();
    expect(result.current.isLoaded).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.version).toBe('');
  });

  it('should load configuration on mount with GET /json', async () => {
    (global.fetch as any).mockResolvedValue({
      json: async () => mockDataJSON,
    });

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    expect(global.fetch).toHaveBeenCalledWith('/json', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    expect(result.current.dataJSON).toEqual(mockDataJSON);
    expect(result.current.error).toBeNull();
  });

  it('should reload configuration with POST /version when version changes', async () => {
    (global.fetch as any).mockResolvedValue({
      json: async () => mockDataJSON,
    });

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    // Change version
    result.current.setVersion('4.0');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/version', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ version: '4.0' }),
      });
    });
  });

  it('should handle fetch errors', async () => {
    const mockError = new Error('Network error');
    (global.fetch as any).mockRejectedValue(mockError);

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('should update entry value', async () => {
    (global.fetch as any).mockResolvedValue({
      json: async () => mockDataJSON,
    });

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    act(() => {
      result.current.updateEntry(1, 'new_value');
    });

    await waitFor(() => {
      expect(result.current.dataJSON?.value[1]).toBe('new_value');
    });
    expect(result.current.dataJSON?.value[0]).toBe('value1');
    expect(result.current.dataJSON?.value[2]).toBe('value3');
  });

  it('should toggle entry enabled state', async () => {
    (global.fetch as any).mockResolvedValue({
      json: async () => mockDataJSON,
    });

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    // Toggle from 1 to 0
    act(() => {
      result.current.toggleEntry(0);
    });

    await waitFor(() => {
      expect(result.current.dataJSON?.is_enabled[0]).toBe(0);
    });

    // Toggle from 0 to 1
    act(() => {
      result.current.toggleEntry(0);
    });

    await waitFor(() => {
      expect(result.current.dataJSON?.is_enabled[0]).toBe(1);
    });
  });

  it('should import configuration successfully', async () => {
    const importedConfig: DataJSON = {
      id: [0, 2],
      tags: ['tag1', 'tag3'],
      value: ['imported1', 'imported3'],
      is_enabled: [1, 1],
      switchable: [1, 1],
      switch_position: [1, 1],
      section_number: [1, 2],
      all_sections: ['Section 1', 'Section 2'],
      available_versions: ['3.5'],
      squid_version: ['3.5'],
      units: ['KB', 'seconds'],
      message_built: ['Built 1', 'Built 3'],
      message_warning: ['Warning 1', 'Warning 3'],
      help: ['Help 1', 'Help 3'],
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        json: async () => mockDataJSON,
      })
      .mockResolvedValueOnce({
        json: async () => importedConfig,
      });

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    const configString = 'imported config string';
    const message = await result.current.importConfig(configString);

    expect(global.fetch).toHaveBeenCalledWith('/import', {
      method: 'POST',
      body: configString,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    expect(message).toContain('Import completed');
    expect(message).toContain('2 entries processed');
    expect(message).toContain('2 recognized');
    expect(result.current.isLoaded).toBe(true);
  });

  it('should handle skipped entries during import (id 999)', async () => {
    const importedConfig: DataJSON = {
      id: [0, 999],
      tags: ['tag1', 'skipped_tag'],
      value: ['imported1', 'skipped_value'],
      is_enabled: [1, 1],
      switchable: [1, 1],
      switch_position: [1, 1],
      section_number: [1, 2],
      all_sections: ['Section 1', 'Section 2'],
      available_versions: ['3.5'],
      squid_version: ['3.5'],
      units: ['KB', 'seconds'],
      message_built: ['Built 1', 'Built 2'],
      message_warning: ['Warning 1', 'Warning 2'],
      help: ['Help 1', 'Help 2'],
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        json: async () => mockDataJSON,
      })
      .mockResolvedValueOnce({
        json: async () => importedConfig,
      });

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    const message = await result.current.importConfig('config');

    expect(message).toContain('2 entries processed');
    expect(message).toContain('1 recognized');
    expect(message).toContain('skipped_tag');
  });

  it('should handle import errors', async () => {
    const mockError = new Error('Import failed');

    (global.fetch as any)
      .mockResolvedValueOnce({
        json: async () => mockDataJSON,
      })
      .mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    await expect(result.current.importConfig('config')).rejects.toThrow('Import failed');

    await waitFor(() => {
      expect(result.current.error).toEqual(mockError);
    });
  });

  it('should throw error if no configuration loaded during import', async () => {
    (global.fetch as any).mockResolvedValue({
      json: async () => mockDataJSON,
    });

    const { result } = renderHook(() => useSquidConfig());

    // Try to import before dataJSON is loaded
    await expect(result.current.importConfig('config')).rejects.toThrow('No configuration loaded');
  });

  it('should reset entries and apply imported values', async () => {
    const importedConfig: DataJSON = {
      id: [1, 0, 2],
      tags: ['tag2', 'tag1', 'tag3'],
      value: ['imported2', 'imported1', 'imported3'],
      is_enabled: [1, 1, 1],
      switchable: [1, 1, 1],
      switch_position: [1, 1, 1],
      section_number: [1, 1, 2],
      all_sections: ['Section 1', 'Section 2'],
      available_versions: ['3.5'],
      squid_version: ['3.5'],
      units: ['MB', 'KB', 'seconds'],
      message_built: ['Built 2', 'Built 1', 'Built 3'],
      message_warning: ['Warning 2', 'Warning 1', 'Warning 3'],
      help: ['Help 2', 'Help 1', 'Help 3'],
    };

    (global.fetch as any)
      .mockResolvedValueOnce({
        json: async () => mockDataJSON,
      })
      .mockResolvedValueOnce({
        json: async () => importedConfig,
      });

    const { result } = renderHook(() => useSquidConfig());

    await waitFor(() => {
      expect(result.current.isLoaded).toBe(true);
    });

    await result.current.importConfig('config');

    await waitFor(() => {
      // All entries should be enabled after import
      expect(result.current.dataJSON?.is_enabled[0]).toBe(1);
      expect(result.current.dataJSON?.is_enabled[1]).toBe(1);
      expect(result.current.dataJSON?.is_enabled[2]).toBe(1);
      // Values should be updated from import
      expect(result.current.dataJSON?.value[0]).toBe('imported1');
      expect(result.current.dataJSON?.value[1]).toBe('imported2');
      expect(result.current.dataJSON?.value[2]).toBe('imported3');
    });
  });

  it('should update entry without dataJSON', () => {
    (global.fetch as any).mockResolvedValue({
      json: async () => mockDataJSON,
    });

    const { result } = renderHook(() => useSquidConfig());

    // Try to update before dataJSON is loaded - should not throw
    act(() => {
      result.current.updateEntry(0, 'test');
    });

    expect(result.current.dataJSON).toBeNull();
  });

  it('should toggle entry without dataJSON', () => {
    (global.fetch as any).mockResolvedValue({
      json: async () => mockDataJSON,
    });

    const { result } = renderHook(() => useSquidConfig());

    // Try to toggle before dataJSON is loaded - should not throw
    act(() => {
      result.current.toggleEntry(0);
    });

    expect(result.current.dataJSON).toBeNull();
  });
});

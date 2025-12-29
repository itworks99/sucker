import { describe, it, expect } from 'vitest';
import { generateSquidConfiguration, createVersionDropdownOptions, createSwitchOptions } from './config';
import type { DataJSON } from '../types';

describe('config utilities', () => {
  describe('generateSquidConfiguration', () => {
    it('should generate configuration from enabled entries', () => {
      const dataJSON: DataJSON = {
        id: [0, 1, 2],
        tags: ['cache_dir', 'cache_mem', 'http_port'],
        value: ['cache_dir /var/spool/squid', 'cache_mem 256 MB', 'http_port 3128'],
        is_enabled: [1, 1, 1],
        switchable: [0, 0, 0],
        switch_position: [0, 0, 0],
        section_number: [1, 1, 2],
        all_sections: ['Section 1', 'Section 2'],
        available_versions: ['3.5'],
        squid_version: ['3.5'],
        units: ['', 'MB', ''],
        message_built: ['Built 1', 'Built 2', 'Built 3'],
        message_warning: ['', '', ''],
        help: ['Help 1', 'Help 2', 'Help 3'],
      };

      const result = generateSquidConfiguration(dataJSON);

      expect(result).toBe('\ncache_dir /var/spool/squid\ncache_mem 256 MB\nhttp_port 3128');
    });

    it('should only include enabled entries', () => {
      const dataJSON: DataJSON = {
        id: [0, 1, 2],
        tags: ['option1', 'option2', 'option3'],
        value: ['value1', 'value2', 'value3'],
        is_enabled: [1, 0, 1],
        switchable: [0, 0, 0],
        switch_position: [0, 0, 0],
        section_number: [1, 1, 1],
        all_sections: ['Section 1'],
        available_versions: ['3.5'],
        squid_version: ['3.5'],
        units: ['', '', ''],
        message_built: ['', '', ''],
        message_warning: ['', '', ''],
        help: ['', '', ''],
      };

      const result = generateSquidConfiguration(dataJSON);

      expect(result).toBe('\nvalue1\nvalue3');
      expect(result).not.toContain('value2');
    });

    it('should return empty string when no entries are enabled', () => {
      const dataJSON: DataJSON = {
        id: [0, 1],
        tags: ['option1', 'option2'],
        value: ['value1', 'value2'],
        is_enabled: [0, 0],
        switchable: [0, 0],
        switch_position: [0, 0],
        section_number: [1, 1],
        all_sections: ['Section 1'],
        available_versions: ['3.5'],
        squid_version: ['3.5'],
        units: ['', ''],
        message_built: ['', ''],
        message_warning: ['', ''],
        help: ['', ''],
      };

      const result = generateSquidConfiguration(dataJSON);

      expect(result).toBe('');
    });

    it('should handle empty dataJSON', () => {
      const dataJSON: DataJSON = {
        id: [],
        tags: [],
        value: [],
        is_enabled: [],
        switchable: [],
        switch_position: [],
        section_number: [],
        all_sections: [],
        available_versions: [],
        squid_version: [],
        units: [],
        message_built: [],
        message_warning: [],
        help: [],
      };

      const result = generateSquidConfiguration(dataJSON);

      expect(result).toBe('');
    });
  });

  describe('createVersionDropdownOptions', () => {
    it('should create dropdown options from version array', () => {
      const versions = ['3.5', '4.0', '5.0'];

      const result = createVersionDropdownOptions(versions);

      expect(result).toEqual([
        { key: 0, text: '3.5', value: '3.5' },
        { key: 1, text: '4.0', value: '4.0' },
        { key: 2, text: '5.0', value: '5.0' },
      ]);
    });

    it('should handle single version', () => {
      const versions = ['3.5'];

      const result = createVersionDropdownOptions(versions);

      expect(result).toEqual([
        { key: 0, text: '3.5', value: '3.5' },
      ]);
    });

    it('should handle empty array', () => {
      const versions: string[] = [];

      const result = createVersionDropdownOptions(versions);

      expect(result).toEqual([]);
    });

    it('should preserve version string format', () => {
      const versions = ['3.5.28', '4.0.1-beta', '5.0-rc1'];

      const result = createVersionDropdownOptions(versions);

      expect(result[0].text).toBe('3.5.28');
      expect(result[1].text).toBe('4.0.1-beta');
      expect(result[2].text).toBe('5.0-rc1');
    });
  });

  describe('createSwitchOptions', () => {
    it('should create on/off switch options with tag', () => {
      const tag = 'cache_dir';

      const result = createSwitchOptions(tag);

      expect(result).toEqual([
        { key: 'cache_dir on', text: 'cache_dir on', value: 'cache_dir on' },
        { key: 'cache_dir off', text: 'cache_dir off', value: 'cache_dir off' },
      ]);
    });

    it('should handle tag with spaces', () => {
      const tag = 'http access';

      const result = createSwitchOptions(tag);

      expect(result).toEqual([
        { key: 'http access on', text: 'http access on', value: 'http access on' },
        { key: 'http access off', text: 'http access off', value: 'http access off' },
      ]);
    });

    it('should handle tag with special characters', () => {
      const tag = 'cache_log_/var/log';

      const result = createSwitchOptions(tag);

      expect(result).toEqual([
        { key: 'cache_log_/var/log on', text: 'cache_log_/var/log on', value: 'cache_log_/var/log on' },
        { key: 'cache_log_/var/log off', text: 'cache_log_/var/log off', value: 'cache_log_/var/log off' },
      ]);
    });

    it('should always return exactly two options', () => {
      const result = createSwitchOptions('any_tag');

      expect(result).toHaveLength(2);
      expect(result[0].text).toContain('on');
      expect(result[1].text).toContain('off');
    });
  });
});

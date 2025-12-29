import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import type {DataJSON} from '../types';
import {StatusMessage} from './StatusMessage';

describe('StatusMessage', () => {
  const mockDataJSON: DataJSON = {
    tags: ['tag1', 'tag2', 'tag3'],
    all_sections: ['section1', 'section2'],
    sections: {},
  };

  it('displays squid version', () => {
    render(<StatusMessage dataJSON={mockDataJSON} version="5.0" statusMessage="" />);
    expect(screen.getByText(/Squid ver./)).toBeTruthy();
    expect(screen.getByText('5.0')).toBeTruthy();
  });

  it('displays number of unique tags', () => {
    render(<StatusMessage dataJSON={mockDataJSON} version="5.0" statusMessage="" />);
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText(/unique tags in/)).toBeTruthy();
  });

  it('displays number of sections', () => {
    render(<StatusMessage dataJSON={mockDataJSON} version="5.0" statusMessage="" />);
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText(/sections/)).toBeTruthy();
  });

  it('displays status message', () => {
    const statusMessage = 'Configuration loaded successfully';
    render(<StatusMessage dataJSON={mockDataJSON} version="5.0" statusMessage={statusMessage} />);
    expect(screen.getByText(statusMessage)).toBeTruthy();
  });

  it('displays legend', () => {
    render(<StatusMessage dataJSON={mockDataJSON} version="5.0" statusMessage="" />);
    expect(screen.getByText('Legend:')).toBeTruthy();
    expect(screen.getByText('- selected section')).toBeTruthy();
    expect(screen.getByText('- section without enabled options')).toBeTruthy();
    expect(screen.getByText('- section with enabled options')).toBeTruthy();
  });

  it('displays different tag counts', () => {
    const dataWithMoreTags: DataJSON = {
      tags: Array.from({length: 10}, (_, i) => `tag${i}`),
      all_sections: ['section1'],
      sections: {},
    };
    render(<StatusMessage dataJSON={dataWithMoreTags} version="5.0" statusMessage="" />);
    expect(screen.getByText('10')).toBeTruthy();
  });

  it('displays different section counts', () => {
    const dataWithMoreSections: DataJSON = {
      tags: ['tag1'],
      all_sections: Array.from({length: 5}, (_, i) => `section${i}`),
      sections: {},
    };
    render(<StatusMessage dataJSON={dataWithMoreSections} version="5.0" statusMessage="" />);
    expect(screen.getByText('5')).toBeTruthy();
  });
});

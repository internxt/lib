import { describe, expect, it } from 'vitest';
import { items } from '../../src';

const { getItemDisplayName } = items;

describe('getItemDisplayName tests', () => {
  it('should generate an items name when it has extension', () => {
    const item = {
      name: 'test',
      type: 'txt',
    };

    expect(getItemDisplayName(item)).toBe('test.txt');
  });

  it('should generate an items name when it has no extension', () => {
    const item = {
      name: 'test',
    };

    expect(getItemDisplayName(item)).toBe('test');
  });
});

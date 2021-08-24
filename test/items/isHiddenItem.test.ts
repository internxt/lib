import { items } from '../../src';

const { isHiddenItem } = items;

describe('isHiddenItem tests', () => {
  it('should return false for a non hidden item', () => {
    const nonHidden = { name: 'test' };

    expect(isHiddenItem(nonHidden)).toBe(false);
  });

  it('should return false for a non hidden item with dots in its name', () => {
    const nonHidden = { name: 'test.yes' };

    expect(isHiddenItem(nonHidden)).toBe(false);
  });

  it('should return false true for a hidden item', () => {
    const hidden = { name: '.test' };

    expect(isHiddenItem(hidden)).toBe(true);
  });

  it('should return false true for a hidden item with other dots in its name', () => {
    const hidden = { name: '.test.yes' };

    expect(isHiddenItem(hidden)).toBe(true);
  });
});

import { items } from '../../src';

const { renameIfNeeded } = items;

describe('renameIfNeeded tests', () => {
  it('Should not rename if a file with the same name doesnt exist', () => {
    const items: { name: string; type: string }[] = [{ name: 'test', type: 'txt' }];
    const filename = 'anothertest';
    const type = 'txt';

    const [alreadyExists, index, finalFilename] = renameIfNeeded(items, filename, type);

    expect(alreadyExists).toBe(false);
    expect(index).toBe(0);
    expect(finalFilename).toBe(filename);
  });

  it('Should not rename if a file with the same name but different type exists', () => {
    const filename = 'test';
    const type = 'docx';

    const items: { name: string; type: string }[] = [{ name: filename, type: 'txt' }];

    const [alreadyExists, index, finalFilename] = renameIfNeeded(items, filename, type);

    expect(alreadyExists).toBe(false);
    expect(index).toBe(0);
    expect(finalFilename).toBe(filename);
  });

  it('Should rename if a file with the same name and type exists', () => {
    const filename = 'test';
    const type = 'txt';

    const items: { name: string; type: string }[] = [{ name: filename, type }];

    const [alreadyExists, index, finalFilename] = renameIfNeeded(items, filename, type);

    expect(alreadyExists).toBe(true);
    expect(index).toBe(1);
    expect(finalFilename).toBe(`${filename} (1)`);
  });

  it('Should rename incrementally', () => {
    const filename = 'test';
    const type = 'txt';

    const items: { name: string; type: string }[] = [
      { name: filename, type },
      { name: `${filename} (1)`, type },
    ];

    const [alreadyExists, index, finalFilename] = renameIfNeeded(items, filename, type);

    expect(alreadyExists).toBe(true);
    expect(index).toBe(2);
    expect(finalFilename).toBe(`${filename} (2)`);
  });

  it('Should rename incrementally even if the clean name does not exist', () => {
    const filename = 'test (1)';
    const type = 'txt';

    const items: { name: string; type: string }[] = [{ name: filename, type }];

    const [alreadyExists, index, finalFilename] = renameIfNeeded(items, filename, type);

    expect(alreadyExists).toBe(true);
    expect(index).toBe(2);
    expect(finalFilename).toBe('test (2)');
  });

  it('Should rename incrementally even if the clean name does not exist (intended name without parenthesis)', () => {
    const filename = 'test';
    const type = 'txt';

    const items: { name: string; type: string }[] = [{ name: `${filename} (1)`, type }];

    const [alreadyExists, index, finalFilename] = renameIfNeeded(items, filename, type);

    expect(alreadyExists).toBe(true);
    expect(index).toBe(2);
    expect(finalFilename).toBe('test (2)');
  });

  it('Should rename incrementally if the clean name exists', () => {
    const filename = 'test';
    const type = 'txt';

    const items: { name: string; type: string }[] = [
      { name: filename, type },
      { name: `${filename} (1)`, type },
    ];

    const [alreadyExists, index, finalFilename] = renameIfNeeded(items, filename, type);

    expect(alreadyExists).toBe(true);
    expect(index).toBe(2);
    expect(finalFilename).toBe('test (2)');
  });

  it('Should rename incrementally if the clean name exists (even if the final name would exist with a different extension)', () => {
    const filename = 'test';
    const type = 'txt';

    const items: { name: string; type: string }[] = [
      { name: filename, type },
      { name: `${filename} (1)`, type: 'pdf' },
    ];

    const [alreadyExists, index, finalFilename] = renameIfNeeded(items, filename, type);

    expect(alreadyExists).toBe(true);
    expect(index).toBe(1);
    expect(finalFilename).toBe('test (1)');
  });
});

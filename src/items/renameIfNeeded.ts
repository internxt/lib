/**
 * Checks if a rename is needed and returns the new filename.
 * For example, if a file test.txt already exists, the new
 * filename will be test (1).txt.
 *
 * @param items Existing items in a folder
 * @param filename Filename of the new item
 * @param type Type of the new item
 * @returns
 * - Whether it already exists
 * - The number between parethensis. 0 if it already exists.
 * - The new filename. It can be the same as the input
 *   if it doesn't exist already.
 */
export default function renameIfNeeded(
  items: { name: string; type: string }[],
  filename: string,
  type: string,
): [boolean, number, string] {
  const FILENAME_INCREMENT_REGEX = /( \([0-9]+\))$/i;
  const INCREMENT_INDEX_REGEX = /\(([^)]+)\)/;

  const cleanFilename = filename.replace(FILENAME_INCREMENT_REGEX, '');

  const infoFilenames: { name: string; cleanName: string; type: string; incrementIndex: number }[] = items
    .map((item) => {
      const cleanName = item.name.replace(FILENAME_INCREMENT_REGEX, '');
      const incrementString = item.name.match(FILENAME_INCREMENT_REGEX)?.pop()?.match(INCREMENT_INDEX_REGEX)?.pop();
      const incrementIndex = parseInt(incrementString || '0');

      return {
        name: item.name,
        cleanName,
        type: item.type,
        incrementIndex,
      };
    })
    .filter((item) => item.cleanName === cleanFilename && item.type === type)
    .sort((a, b) => b.incrementIndex - a.incrementIndex);

  const filenameExists = !!infoFilenames.length;

  if (filenameExists) {
    const index = infoFilenames[0].incrementIndex + 1;

    return [true, index, getNextNewName(cleanFilename, index)];
  } else {
    return [false, 0, filename];
  }
}

function getNextNewName(filename: string, i: number): string {
  return `${filename} (${i})`;
}

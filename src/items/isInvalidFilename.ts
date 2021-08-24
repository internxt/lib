/**
 *
 * @param filename Filename without extension
 * @returns If its invalid or not according to Internxt's policy
 */
export default function isInvalidFilename(filename: string): boolean {
  return !!filename.match(/[/\\]|^\s*$|.+\s+$|^\./);
}

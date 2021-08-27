/**
 * Given an item returns its display name
 *
 * @param item An item
 * @param item.name Item's name
 * @param item.type Item's type, optional
 * @returns Item's display name
 */
export default function getItemDisplayName(item: { name: string; type?: string }): string {
  const { name, type } = item;

  return `${name}${type ? '.' + type : ''}`;
}

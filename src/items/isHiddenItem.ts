/**
 * @param item Item to check
 * @param item.name Name of the item to check
 * @returns If its or not considered hidden
 */
export default function isHiddenItem(item: { name: string }): boolean {
  return !!item.name.match(/^\./);
}

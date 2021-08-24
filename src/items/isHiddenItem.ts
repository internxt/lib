/**
 * @param item It has to contain a name property
 * @returns If its or not considered hidden
 */
export default function isHiddenItem(item: { name: string }): boolean {
  return !!item.name.match(/^\..*$/);
}

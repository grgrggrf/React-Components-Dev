import type { SidebarItem } from "./ResponsiveSidebar.types";

/** 仅记录树的父子关系；保留原始节点和 React 图标，不对菜单做深拷贝。 */
export function normalizeOpenKeys(items: SidebarItem[], keys: string[], accordion: boolean) {
  const parents = new Map<string, string | null>();
  function visit(nodes: SidebarItem[], parent: string | null) {
    for (const item of nodes) {
      if (item.children?.length) {
        parents.set(item.key, parent);
        visit(item.children, item.key);
      }
    }
  }
  visit(items, null);
  const valid = keys.filter(key => parents.has(key));
  const siblings = new Map<string | null, string>();
  for (const key of valid) siblings.set(parents.get(key)!, key);
  const candidates = new Set(accordion ? siblings.values() : valid);
  return [...candidates].filter(key => {
    let parent = parents.get(key);
    while (parent != null) {
      if (!candidates.has(parent)) return false;
      parent = parents.get(parent);
    }
    return true;
  });
}

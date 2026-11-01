// Keep an expanded ancestor when its nested submenu changes. Sibling branches
// close predictably without collapsing the branch that contains the selection.
export function toggleSchoolSubmenu(previous,path){
  if(previous[path])return Object.fromEntries(Object.entries(previous).filter(([key])=>key!==path&&!key.startsWith(`${path}/`)))
  return {...Object.fromEntries(Object.entries(previous).filter(([key])=>path.startsWith(`${key}/`))),[path]:true}
}
export const schoolSubmenuId=path=>`school-submenu-${path.replace(/[^a-z0-9]+/gi,'-')}`

export function navigationFocusTargets(drawer,toggle){
  return [toggle,...drawer.querySelectorAll('a[href],button:not([disabled])')]
    .filter(node=>node&&!node.closest('[hidden]')&&node.getClientRects().length>0)
}

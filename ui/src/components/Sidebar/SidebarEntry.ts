export type SidebarEntry = {
  label: string;
  path: string;
  icon: JSX.Element;
  activeSubroutes?: boolean;
  render: () => JSX.Element;
  children: SidebarEntry[];
  divider?: boolean;
  groupBy?: string;
  topMenuButtons?: JSX.Element[];
};

export const getChildren = (e: SidebarEntry): SidebarEntry[] => {
  return e.children.concat(e.children.flatMap(c => getChildren(c)));
};

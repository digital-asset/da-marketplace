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

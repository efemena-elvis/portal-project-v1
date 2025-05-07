import type { Component } from "vue";

export interface IRouteType {
  path: string;
  alias?: string;
  name?: string;
  component: Component | (() => Component | Promise<Component>);
  meta?: {
    title: string;
    guest?: boolean;
    open?: boolean;
    requiresAuth?: boolean;
    description?: string;
    pageMeta?: {
      title: string;
      description: string;
      basePath?: string;
      basePathIcon?: string;
    };
  };
  children?: IRouteType[];
}

export interface IRouteGroupType {
  slug?: string;
  link: string;
  title: string;
  icon: string;
  active: boolean;
  category?: string;
}

export interface ISidebarRouteType {
  topLevel: IRouteGroupType[];
  subLevel: IRouteGroupType[];
  bottomLevel: IRouteGroupType[];
}

export interface ISideNavType {
  routeTitle: string;
  routeLinkName: string;
}

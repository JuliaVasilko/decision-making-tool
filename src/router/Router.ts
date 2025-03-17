import type { Component } from "@/utils/component";

type RouteHandler = () => Component;

type Routes = Record<string, RouteHandler>;

export class Router {
  private routes: Routes;
  private appRoot: HTMLElement;
  private currentComponent: Component | null = null;

  constructor(routes: Routes, root: HTMLElement) {
    this.routes = routes;
    this.appRoot = root;
    this.init();
  }

  public navigate(path: string): void {
    if (this.routes[path]) {
      history.pushState(null, "", path);
      this.renderRoute();
    } else {
      this.navigate("/404");
    }
  }

  private init(): void {
    window.addEventListener("popstate", () => this.renderRoute());
    document.addEventListener("DOMContentLoaded", () => this.renderRoute());
  }

  private renderRoute(): void {
    const path = window.location.pathname;
    const routeComponent = this.routes[path] || this.routes["/404"];

    if (routeComponent) {
      if (this.currentComponent) {
        this.currentComponent.remove();
      }
      this.currentComponent = routeComponent();
      this.appRoot.appendChild(this.currentComponent.getNode());
    }
  }
}

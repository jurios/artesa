import { CommandClass } from './command/command';
import { CommandNotFoundException } from './exceptions/command-not-found.exception';
import { RouterException } from './exceptions/router.exception';

export type Routes = { [route: string]: CommandClass };

export class Router {
  constructor(public readonly routes: Routes) {
    this.validateRoutes(routes);
  }

  protected validateRoutes(routes: Routes): void {
    Object.keys(routes).forEach((route) => {
      if (new RegExp(/\s/g).test(route)) {
        throw new RouterException(`Cannot use whitespaces in route "${route}"`);
      }
    });
  }

  /**
   * Look for the most suitable route. It returns the token list which match the route
   *
   * @throws CommandNotFoundException
   * @protected
   * @param route
   */
  public route(route: string): CommandClass {
    if (this.routes[route]) {
      return this.routes[route];
    }

    throw new CommandNotFoundException(route);
  }
}

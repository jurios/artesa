import { CommandClass } from '../command/command';
import * as arg from 'arg';
import { CommandNotFoundException } from '../exceptions/command-not-found.exception';
import { Routes } from './routes';

export type RouteResult = {
  target: CommandClass | Routes;
  argv: string[];
  routePath: string[];
};

export class Router {
  constructor(protected readonly _routes: Routes) {}

  public route(argv: string[]): RouteResult {
    return this.bind(argv, this._routes, []);
  }

  protected bind(argv: string[], routes: Routes, parentPath: string[]): RouteResult {
    const result: arg.Result<arg.Spec> = arg(
      {},
      {
        argv,
        permissive: true,
        stopAtPositional: true,
      },
    );

    const argumentsParsed: string[] = result._.filter((item) => !item.startsWith('-'));

    if (argumentsParsed.length > 0) {
      const commandPath: string = argumentsParsed[0];
      const commandPathIndex: number = result._.indexOf(commandPath);
      result._.splice(commandPathIndex, 1);

      if (routes[commandPath] && typeof routes[commandPath] === 'function') {
        return {
          target: routes[commandPath] as CommandClass,
          argv: result._,
          routePath: parentPath.concat(commandPath),
        };
      }

      if (routes[commandPath] && typeof routes[commandPath] === 'object') {
        parentPath.push(commandPath);
        return this.bind(result._, routes[commandPath] as Routes, parentPath);
      }

      if (!routes[commandPath]) {
        throw new CommandNotFoundException(parentPath.concat(commandPath).join(' '));
      }
    } else {
      return {
        target: routes as Routes,
        argv: result._,
        routePath: parentPath,
      };
    }

    return null;
  }
}

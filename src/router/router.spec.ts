import { Router, RouteResult } from './route';
import { Command } from '../command/command';
import { CommandNotFoundException } from '../exceptions/command-not-found.exception';

class TestCommand extends Command {
  protected handle(): Promise<number> {
    return Promise.resolve(0);
  }
}

describe(Router.name, () => {
  describe('route', () => {
    it('should return a command', () => {
      const router: Router = new Router({
        item: TestCommand,
      });

      expect(router.route(['item'])).toStrictEqual<RouteResult>({
        target: TestCommand,
        argv: [],
      });
    });

    it('should return a nested command', () => {
      const router: Router = new Router({
        item: {
          other: TestCommand,
        },
      });

      expect(router.route(['item', 'other'])).toStrictEqual<RouteResult>({
        target: TestCommand,
        argv: [],
      });
    });

    it('should not consider options as command path', () => {
      const router: Router = new Router({
        item: {
          other: TestCommand,
        },
      });

      expect(router.route(['item', '--option', 'other', 'arg1'])).toStrictEqual<RouteResult>({
        target: TestCommand,
        argv: ['--option', 'arg1'],
      });
    });

    it('should return arguments and options in the result argv', () => {
      const router: Router = new Router({
        item: {
          other: TestCommand,
        },
      });

      expect(router.route(['item', 'other', 'arg1', '--opt1'])).toStrictEqual<RouteResult>({
        target: TestCommand,
        argv: ['arg1', '--opt1'],
      });
    });

    it('should return the route list if the path points to a route list', () => {
      const router: Router = new Router({
        item: {
          other: TestCommand,
        },
      });

      expect(router.route(['item', '--opt1'])).toStrictEqual<RouteResult>({
        target: {
          other: TestCommand,
        },
        argv: ['--opt1'],
      });
    });

    it('should throw a CommandNotFoundException if there is not path', () => {
      const router: Router = new Router({
        item: {
          other: TestCommand,
        },
      });

      const t = () => {
        router.route(['other', 'arg1', '--opt1']);
      };

      expect(t).toThrow(CommandNotFoundException);
    });
  });
});

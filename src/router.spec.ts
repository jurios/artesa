import { Router } from './router';
import { Command } from './command/command';
import { RouterException } from './exceptions/router.exception';

describe(Router.name, () => {
  class TestCommand extends Command {
    handle(): Promise<number> {
      return Promise.resolve(0);
    }
  }

  class OtherCommand extends Command {
    handle(): Promise<number> {
      return Promise.resolve(0);
    }
  }

  let router: Router;

  beforeEach(() => {
    router = new Router({
      first: TestCommand,
      'first:second': OtherCommand,
    });
  });

  describe('constructor', () => {
    it('should throw an exception if a route uses whitespaces', () => {
      const t = () => {
        router = new Router({
          first: TestCommand,
          'first second': OtherCommand,
        });
      };

      expect(t).toThrow(RouterException);
    });
  });
  describe('route', () => {
    it('should return the valid result', () => {
      expect(router.route('first')).toStrictEqual(TestCommand);
      expect(router.route('first:second')).toStrictEqual(OtherCommand);
    });
  });
});

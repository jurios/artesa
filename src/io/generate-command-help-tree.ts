import { Command, CommandClass } from '../command/command';
import { InputOutput } from './input-output';
import { Routes } from '../router/routes';

export type CommandHelpTree = { [route: string]: string | CommandHelpTree };

/**
 * Explores routes to generate a tree used by the group command help
 *
 * @param routes
 */
export function generateCommandHelpTree(routes: Routes): CommandHelpTree {
  const result: CommandHelpTree = {};

  Object.keys(routes).forEach((route) => {
    if (typeof routes[route] === 'function') {
      const command: Command = new (routes[route] as CommandClass)(new InputOutput());
      result[route] = command.getDescription();
    } else {
      result[route] = generateCommandHelpTree(routes[route] as Routes);
    }
  });

  return result;
}

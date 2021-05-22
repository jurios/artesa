import { CommandGroup, Routes } from '../command/command-group';
import { Command } from '../command/command';
import { InputOutput } from './input-output';

export type CommandHelpTree = { [route: string]: string | CommandHelpTree };

/**
 * Explores routes to generate a tree used by the group command help
 *
 * @param routes
 */
export function generateCommandHelpTree(routes: Routes): CommandHelpTree {
  const result: CommandHelpTree = {};

  Object.keys(routes).forEach((route) => {
    const command: Command = new routes[route](new InputOutput());
    result[route] =
      command instanceof CommandGroup
        ? generateCommandHelpTree(command.routes)
        : command.getDescription();
  });

  return result;
}

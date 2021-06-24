import { CommandClass } from '../command/command';

export type Routes = { [path: string]: CommandClass | Routes };

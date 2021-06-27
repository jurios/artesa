import { TextStyle } from './text-renderer/text-renderer';
import { QuestionType, ValidationCallback } from './ask/ask';

export interface IInputOutput {
  close(): void;

  //Output methods
  write(message: string, style?: Partial<TextStyle>): void;
  writeLn(message: string, style?: Partial<TextStyle>): void;
  success(message: string): void;
  warning(message: string): void;
  error(message: string): void;
  err(message: string, style?: Partial<TextStyle>): void;
  errLn(message: string, style?: Partial<TextStyle>): void;
  space(lines?: number): void;

  //Input methods
  ask(
    question: string,
    type: QuestionType.String,
    defaultValue?: string,
    validation?: ValidationCallback<string>,
  ): Promise<string>;
  ask(
    question: string,
    type: QuestionType.Number,
    defaultValue?: number,
    validation?: ValidationCallback<number>,
  ): Promise<number>;
  ask(
    question: string,
    type: QuestionType.Boolean,
    defaultValue?: boolean,
    validation?: ValidationCallback<boolean>,
  ): Promise<boolean>;
  ask(
    question: string,
    type: QuestionType.Secret,
    defaultValue?: string,
    validation?: ValidationCallback<string>,
  ): Promise<string>;
  ask<T extends string | boolean | number>(
    question: string,
    type: QuestionType,
    defaultValue?: T,
    validation?: ValidationCallback<T>,
  ): Promise<T>;
}

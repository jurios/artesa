import { IStream } from './stream/stream.interface';
import { Answer, IInputOutput, QuestionType, ValidationCallback } from './input-output.interface';
import { ConsoleStream } from './stream/console.stream';
import * as inquirer from 'inquirer';
import { KeywordColor } from './colors';
import { defaultTextStyle, renderText, TextStyle } from './text-renderer/text-renderer';

export class InputOutput implements IInputOutput {
  protected _textStyle: TextStyle;
  protected _prompt: inquirer.PromptModule;

  constructor(
    protected pipe: IStream = new ConsoleStream(),
    customStyle: Partial<TextStyle> = defaultTextStyle,
  ) {
    this._prompt = inquirer.createPromptModule();
    this._textStyle = Object.assign({}, defaultTextStyle, customStyle);
  }

  close(): void {
    // Close elements which requires being closed before leaving IO
  }

  write(message: string, style?: Partial<TextStyle>): void {
    this.pipe.stdout.write(renderText(message, Object.assign({}, this._textStyle, style)));
  }

  writeLn(message: string, style?: Partial<TextStyle>): void {
    this.write(message, style);
    this.pipe.stdout.write('\n');
  }

  err(message: string, style?: Partial<TextStyle>): void {
    this.pipe.stderr.write(renderText(message, Object.assign({}, this._textStyle, style)));
  }

  errLn(message: string, style?: Partial<TextStyle>): void {
    this.err(message, style);
    this.pipe.stderr.write('\n');
  }

  success(message: string): void {
    return this.writeLn(' :check:  ' + message, {
      bold: true,
      color: KeywordColor.White,
      backgroundColor: KeywordColor.Success,
    });
  }

  warning(message: string): void {
    return this.writeLn(' :warning:  ' + message, {
      bold: true,
      color: KeywordColor.Black,
      backgroundColor: KeywordColor.Warning,
    });
  }

  error(message: string): void {
    return this.errLn(' :error:  ' + message, {
      bold: true,
      color: KeywordColor.White,
      backgroundColor: [248, 113, 113],
    });
  }

  space(lines = 1): void {
    this.pipe.stdout.write('\n'.repeat(lines));
  }

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
  ): Promise<T> {
    switch (type) {
      case QuestionType.String:
        return this.askForString(
          question,
          defaultValue as string,
          validation as ValidationCallback<string>,
        ) as Promise<T>;
      case QuestionType.Number:
        return this.askForNumber(
          question,
          defaultValue as number,
          validation as ValidationCallback<number>,
        ) as Promise<T>;
      case QuestionType.Boolean:
        return this.askForBoolean(
          question,
          defaultValue as boolean,
          validation as ValidationCallback<boolean>,
        ) as Promise<T>;
      case QuestionType.Secret:
        return this.askForSecret(
          question,
          defaultValue as string,
          validation as ValidationCallback<string>,
        ) as Promise<T>;
      default:
        throw new TypeError(`Asking for type "${type}" not supported.`);
    }
  }

  protected askForString(
    question: string,
    defaultValue?: string,
    validation?: ValidationCallback<string>,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._prompt<Answer<string>>({
        type: 'input',
        name: 'answer',
        default: defaultValue,
        message: question,
        validate: validation,
      })
        .then((value) => resolve(value.answer))
        .catch((e) => reject(e));
    });
  }

  protected askForNumber(
    question: string,
    defaultValue?: number,
    validation?: ValidationCallback<number>,
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._prompt<Answer<number>>({
        type: 'number',
        name: 'answer',
        default: defaultValue,
        message: question,
        validate: validation,
      })
        .then((value) => resolve(value.answer))
        .catch((e) => reject(e));
    });
  }

  protected askForBoolean(
    question: string,
    defaultVale?: boolean,
    validation?: ValidationCallback<boolean>,
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this._prompt<Answer<boolean>>({
        type: 'confirm',
        name: 'answer',
        default: defaultVale,
        message: question,
        validate: validation,
      })
        .then((value) => resolve(value.answer))
        .catch((e) => reject(e));
    });
  }

  protected askForSecret(
    question: string,
    defaultValue?: string,
    validation?: ValidationCallback<string>,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._prompt<Answer<string>>({
        type: 'password',
        name: 'answer',
        default: defaultValue,
        message: question,
        validate: validation,
      })
        .then((value) => resolve(value.answer))
        .catch((e) => reject(e));
    });
  }
}

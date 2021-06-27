import { IStream } from './stream/stream.interface';
import { IInputOutput } from './input-output.interface';
import { ConsoleStream } from './stream/console.stream';
import { KeywordColor } from './colors';
import { defaultTextStyle, renderText, TextStyle } from './text-renderer/text-renderer';
import { Ask, QuestionType, ValidationCallback } from './ask/ask';

export class InputOutput implements IInputOutput {
  protected _textStyle: TextStyle;

  constructor(
    protected pipe: IStream = new ConsoleStream(),
    customStyle: Partial<TextStyle> = defaultTextStyle,
  ) {
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
    const ask = new Ask();

    return ask.ask<T>(question, type, defaultValue, validation);
  }
}

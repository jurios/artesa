import type * as inquirer from 'inquirer';

export enum QuestionType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Secret = 'secret',
}

export type Answer<T> = { answer: T };
export type ValidationCallback<T> = (value: T) => true | string;

export class Ask {
  protected _inquirer: inquirer.Inquirer;
  protected _prompt: inquirer.PromptModule;

  constructor() {
    /* eslint-disable @typescript-eslint/no-var-requires */
    this._inquirer = require('inquirer');

    this._prompt = this._inquirer.createPromptModule();
  }

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

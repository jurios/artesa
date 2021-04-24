export class Bag {
  constructor(protected readonly items: Record<string, unknown> = {}) {}

  add(name: string, value: unknown): void {
    this.items[name] = value;
  }

  has(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.items, name) && this.items[name] !== undefined;
  }

  get<T = unknown>(name: string): T {
    if (this.has(name)) {
      return this.items[name] as T;
    }

    return undefined;
  }
}

export class ArgumentBag extends Bag {}
export class OptionBag extends Bag {}

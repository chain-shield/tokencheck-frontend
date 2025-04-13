// Type definitions for Jest
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      (...args: Y): T;
      mockImplementation(fn: (...args: Y) => T): this;
      mockImplementationOnce(fn: (...args: Y) => T): this;
      mockReturnValue(value: T): this;
      mockReturnValueOnce(value: T): this;
      mockResolvedValue(value: T): this;
      mockResolvedValueOnce(value: T): this;
      mockRejectedValue(value: any): this;
      mockRejectedValueOnce(value: any): this;
      mockClear(): this;
      mockReset(): this;
      mockRestore(): this;
      mockName(name: string): this;
      getMockName(): string;
      mock: {
        calls: Y[];
        instances: T[];
        invocationCallOrder: number[];
        results: { type: string; value: T }[];
      };
    }

    function fn<T = any, Y extends any[] = any[]>(): Mock<T, Y>;
    function fn<T = any, Y extends any[] = any[]>(implementation: (...args: Y) => T): Mock<T, Y>;
    
    function requireMock(moduleName: string): any;
    function requireActual(moduleName: string): any;
    
    function spyOn<T extends {}, M extends keyof T>(object: T, method: M): Mock;
    
    function clearAllMocks(): void;
    function resetAllMocks(): void;
    function restoreAllMocks(): void;
  }

  function describe(name: string, fn: () => void): void;
  function describe(table: string, name: string, fn: () => void): void;
  namespace describe {
    function each(table: any[]): (name: string, fn: (...args: any[]) => any) => void;
    function skip(name: string, fn: () => void): void;
    function only(name: string, fn: () => void): void;
  }

  function beforeEach(fn: () => void): void;
  function beforeEach(fn: () => Promise<void>): void;
  function afterEach(fn: () => void): void;
  function afterEach(fn: () => Promise<void>): void;

  function beforeAll(fn: () => void): void;
  function beforeAll(fn: () => Promise<void>): void;
  function afterAll(fn: () => void): void;
  function afterAll(fn: () => Promise<void>): void;

  function it(name: string, fn: () => void): void;
  function it(name: string, fn: () => Promise<void>): void;
  namespace it {
    function each(table: any[]): (name: string, fn: (...args: any[]) => any) => void;
    function skip(name: string, fn: () => void): void;
    function only(name: string, fn: () => void): void;
    function todo(name: string): void;
  }

  function test(name: string, fn: () => void): void;
  function test(name: string, fn: () => Promise<void>): void;
  namespace test {
    function each(table: any[]): (name: string, fn: (...args: any[]) => any) => void;
    function skip(name: string, fn: () => void): void;
    function only(name: string, fn: () => void): void;
    function todo(name: string): void;
  }

  function expect(actual: any): jest.Matchers<any>;
}

// Extend the Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveClass(className: string): R;
      toHaveStyle(style: Record<string, any>): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveAttribute(attr: string, value?: any): R;
      toHaveFocus(): R;
      toBeChecked(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toBeInvalid(): R;
      toBeEmptyDOMElement(): R;
      toHaveValue(value: any): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toHaveDescription(text: string | RegExp): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toBeEmpty(): R;
      toBeNull(): R;
      toBeUndefined(): R;
      toBeDefined(): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeNaN(): R;
      toEqual(expected: any): R;
      toStrictEqual(expected: any): R;
      toBe(expected: any): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(times: number): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenLastCalledWith(...args: any[]): R;
      toHaveBeenNthCalledWith(nth: number, ...args: any[]): R;
      toHaveReturned(): R;
      toHaveReturnedTimes(times: number): R;
      toHaveReturnedWith(value: any): R;
      toHaveLastReturnedWith(value: any): R;
      toHaveNthReturnedWith(nth: number, value: any): R;
      toHaveLength(length: number): R;
      toHaveProperty(keyPath: string | Array<string>, value?: any): R;
      toBeInstanceOf(expected: any): R;
      toMatch(expected: string | RegExp): R;
      toMatchObject(expected: object | Array<object>): R;
      toMatchSnapshot(hint?: string): R;
      toMatchInlineSnapshot(snapshot?: string): R;
      toThrow(error?: string | RegExp | Error | Function): R;
      toThrowError(error?: string | RegExp | Error | Function): R;
      toThrowErrorMatchingSnapshot(hint?: string): R;
      toThrowErrorMatchingInlineSnapshot(snapshot?: string): R;
    }
  }
}

export {};

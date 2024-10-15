// Uncomment the code below and write your tests
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import path from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const fn = jest.fn();
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(fn, 1000);
    expect(setTimeout).toBeCalledWith(fn, 1000);
  });

  test('should call callback only after timeout', () => {
    const fn = jest.fn();
    doStuffByTimeout(fn, 1000);
    expect(fn).not.toBeCalled();

    jest.advanceTimersByTime(1000);
    expect(fn).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const fn = jest.fn();
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(fn, 1000);
    expect(setInterval).toBeCalledWith(fn, 1000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const fn = jest.fn();
    doStuffByInterval(fn, 1000);
    expect(fn).not.toBeCalled();

    jest.advanceTimersByTime(1000);
    expect(fn).toBeCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(fn).toBeCalledTimes(2);
  });
});

jest.mock('fs');
jest.mock('fs/promises');

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spy = jest.spyOn(path, 'join');
    const fileName = 'file.txt';
    await readFileAsynchronously(fileName);
    expect(spy).toBeCalledWith(__dirname, fileName);
  });

  test('should return null if file does not exist', async () => {
    const fileName = 'file.txt';
    (existsSync as jest.Mock).mockReturnValue(false);
    const file = await readFileAsynchronously(fileName);
    expect(file).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileName = 'file.txt';
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue('text');

    const file = await readFileAsynchronously(fileName);
    expect(file).toBe('text');
  });
});

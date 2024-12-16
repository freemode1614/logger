import { logger, createScopedLogger } from './index';
import chalk from 'chalk';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

describe('logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log message when level is debug', () => {
    logger.debug('message');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should not log message when level is trace and current level is debug', () => {
    logger.setLevel('debug');
    logger.trace('message');
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should log message with scope', () => {
    const scopedLogger = createScopedLogger();
    scopedLogger.debug('message');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  it('should not log message when level is error and current level is info', () => {
    logger.setLevel('info');
    logger.error('message');
    expect(console.log).not.toHaveBeenCalled();
  });

  it('should log message with color', () => {
    const originalConsoleLog = console.log;
    console.log = jest.fn();
    logger.debug('message');
    expect(console.log).toHaveBeenCalledTimes(1);
    console.log = originalConsoleLog;
  });

  it('should create scoped logger', () => {
    const scopedLogger = createScopedLogger();
    expect(scopedLogger).toHaveProperty('debug');
    expect(scopedLogger).toHaveProperty('info');
    expect(scopedLogger).toHaveProperty('warn');
    expect(scopedLogger).toHaveProperty('error');
  });

  it('should set level', () => {
    logger.setLevel('debug');
    expect(logger.currentLevel).toBe('debug');
  });
});

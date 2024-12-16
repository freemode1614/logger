import { describe, expect, it, vi } from 'vitest';
import {
  logger,
  createScopedLogger,
  DebugLevel,
} from './index';

describe('logger', () => {
  it('should log messages at the correct level', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    logger.trace('trace message');
    logger.debug('debug message');
    logger.info('info message');
    logger.warn('warn message');
    logger.error('error message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(5);
  });

  it('should not log messages below the current level', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    logger.setLevel('info');
    logger.trace('trace message');
    logger.debug('debug message');
    logger.info('info message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it('should log scoped messages', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    const scopedLogger = createScopedLogger('myScope');
    scopedLogger.trace('trace message');
    scopedLogger.debug('debug message');
    scopedLogger.info('info message');

    expect(consoleLogSpy).toHaveBeenCalledTimes(3);
  });

  it('should not log messages in production mode', () => {
    const consoleLogSpy = vi.spyOn(console, 'log');
    process.env.NODE_ENV = 'production';
    logger.trace('trace message');
    logger.debug('debug message');

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});

describe('createScopedLogger', () => {
  it('should create a new scoped logger', () => {
    const scopedLogger = createScopedLogger('myScope');
    expect(scopedLogger).toHaveProperty('trace');
    expect(scopedLogger).toHaveProperty('debug');
    expect(scopedLogger).toHaveProperty('info');
    expect(scopedLogger).toHaveProperty('warn');
    expect(scopedLogger).toHaveProperty('error');
  });
});

describe('getLabelStyles', () => {
  it('should return the correct label styles', () => {
    const labelStyles = getLabelStyles('#77828D', '#FFFFFF');
    expect(labelStyles).toBe(`background-color: #77828D; color: white; border: 4px solid #77828D; color: #FFFFFF; `);
  });
});

describe('getStyledLabel', () => {
  it('should return the correct styled label', () => {
    const styledLabel = getStyledLabel('#77828D', '#FFFFFF', 'myLabel');
    expect(styledLabel).toBe(`\x1b[40m\x1b[37m\x1b[1mmyLabel\x1b[0m`);
  });
});

describe('getColorForLevel', () => {
  it('should return the correct color for each level', () => {
    expect(getColorForLevel('trace')).toBe('#77828D');
    expect(getColorForLevel('debug')).toBe('#77828D');
    expect(getColorForLevel('info')).toBe('#1389FD');
    expect(getColorForLevel('warn')).toBe('#FFDB6C');
    expect(getColorForLevel('error')).toBe('#EE4744');
  });
});

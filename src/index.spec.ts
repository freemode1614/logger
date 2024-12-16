import { describe, expect, it, vi } from "vitest";

import { createScopedLogger, DebugLevel, logger } from "./index";

describe("logger", () => {
  it("should call console.log when log level is set to trace", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.trace("test message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log when log level is set to debug", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.debug("test message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log when log level is set to info", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.info("test message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log when log level is set to warn", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.warn("test message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it("should call console.log when log level is set to error", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.error("test message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it("should not call console.log when log level is set to trace and message is empty", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.trace("");
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});

describe("createScopedLogger", () => {
  it("should return a new logger object with the given scope", () => {
    const scopedLogger = createScopedLogger("test scope");
    expect(scopedLogger).toHaveProperty("trace");
    expect(scopedLogger).toHaveProperty("debug");
    expect(scopedLogger).toHaveProperty("info");
    expect(scopedLogger).toHaveProperty("warn");
    expect(scopedLogger).toHaveProperty("error");
  });

  it("should call console.log when log level is set to trace on the scoped logger", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    const scopedLogger = createScopedLogger("test scope");
    scopedLogger.trace("test message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });
});

describe("setLogLevel", () => {
  it("should set the log level to the given value", () => {
    logger.setLevel(DebugLevel.TRACE);
    expect(logger.getLevel()).toBe(DebugLevel.TRACE);
  });

  it("should not call console.log when log level is set to a higher level than the message", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.setLevel(DebugLevel.INFO);
    logger.trace("test message");
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});

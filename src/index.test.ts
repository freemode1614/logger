import { describe, expect, it, vi } from "vitest";

import { createScopedLogger, logger } from "./index";

describe("logger", () => {
  it("should log messages with correct level", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.setLevel("trace");
    logger.trace("trace message");
    logger.debug("debug message");
    logger.info("info message");
    logger.warn("warn message");
    logger.error("error message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(5);
  });

  it("should not log messages below current level", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.setLevel("info");
    logger.trace("trace message");
    logger.debug("debug message");
    logger.info("info message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });

  it("should log scoped messages with correct level", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    const scopedLogger = createScopedLogger("scope");
    scopedLogger.setLevel("trace");
    scopedLogger.trace("trace message");
    scopedLogger.debug("debug message");
    scopedLogger.info("info message");
    scopedLogger.warn("warn message");
    scopedLogger.error("error message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(5);
  });

  it("should not log scoped messages below current level", () => {
    const consoleLogSpy = vi.spyOn(console, "log");
    logger.setLevel("info");
    const scopedLogger = createScopedLogger("scope");
    scopedLogger.trace("trace message");
    scopedLogger.debug("debug message");
    scopedLogger.info("info message");
    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
  });
});

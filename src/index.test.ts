/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createScopedLogger, logger } from "./index";

describe("logger", () => {
  let consoleMocks: Record<string, any>;

  beforeEach(() => {
    consoleMocks = {
      log: vi.spyOn(console, "log"),
      warn: vi.spyOn(console, "warn"),
      error: vi.spyOn(console, "error"),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should log messages with correct level", () => {
    logger.setLevel("trace");
    logger.trace("trace message");
    logger.debug("debug message");
    logger.info("info message");
    logger.warn("warn message");
    logger.error("error message");
    expect(consoleMocks.log).toHaveBeenCalledTimes(5);
  });

  it("should not log messages below current level", () => {
    logger.setLevel("info");
    logger.trace("trace message");
    logger.debug("debug message");
    logger.info("info message");
    expect(consoleMocks.log).toHaveBeenCalledTimes(1);
  });

  it("should log scoped messages with correct level", () => {
    const scopedLogger = createScopedLogger("scope");
    scopedLogger.setLevel("trace");
    scopedLogger.trace("trace message");
    scopedLogger.debug("debug message");
    scopedLogger.info("info message");
    scopedLogger.warn("warn message");
    scopedLogger.error("error message");
    expect(consoleMocks.log).toHaveBeenCalledTimes(5);
  });

  it("should not log scoped messages below current level", () => {
    logger.setLevel("info");
    const scopedLogger = createScopedLogger("scope");
    scopedLogger.trace("trace message");
    scopedLogger.debug("debug message");
    scopedLogger.info("info message");
    expect(consoleMocks.log).toHaveBeenCalledTimes(1);
  });

  it("should format scoped messages correctly", () => {
    const scopedLogger = createScopedLogger("TestScope");
    scopedLogger.info("test message");
    expect(consoleMocks.log).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringMatching("INFO"),
      expect.stringContaining("TestScope"),
      "test message",
    );
  });

  it("should concatenate multiple messages", () => {
    logger.info("message1", "message2");
    expect(consoleMocks.log).toHaveBeenCalledWith(expect.any(String), expect.any(String), "", "message1 message2");
  });

  it("should include timestamp in logs", () => {
    logger.info("test");
    expect(consoleMocks.log).toHaveBeenCalledWith(
      expect.stringMatching(/\[\d{1,2}\/\d{1,2}\/\d{4}\s\d{2}:\d{2}:\d{2}\]/),
      expect.any(String),
      expect.any(String),
      "test",
    );
  });
});

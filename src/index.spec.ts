import { expect, test } from "vitest";

import { createScopedLogger } from "../src";

test("logger", () => {
  expect(() => {
    const logger = createScopedLogger("vitest");
    logger.info("abc");
    logger.error("cba");
    logger.warn("abc");
    logger.trace("abc");
    logger.debug("abc");
  }).not.toThrow();
});

import { createScopedLogger } from "../npm/index.js";

const logger1 = createScopedLogger("scope1");

logger1.warn("Warning test");
logger1.info("Info test");
logger1.error("Info test");

const logger2 = createScopedLogger("scope2");

logger2.warn("Warning test");
logger2.info("Info test");
logger2.error("Info test");

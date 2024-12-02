import { createScopedLogger } from "../npm/index.js";

const logger = createScopedLogger("scope1");

logger.warn("Warning test");
logger.info("Info test");
logger.error("Info test");

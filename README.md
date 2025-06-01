# @moccona/logger

logger function folk from <https://github.com/coleam00/bolt.new-any-llm/blob/cb1fd38df6517fe33cc89f727b2c87d6bb63cb1c/app/utils/logger.ts>

Works in both node and browser.

## Usages

- Use default logger methods.

```ts
import { logger } from "@moccona/logger"

logger.trace('xxxx', 'xxxx', 'xxxx')

```

- Create scopped logger.

```ts
import { createScopedLogger } from "@moccona/logger"

const logger = createScopedLogger("Home");

logger.info('xxx', 12)

```

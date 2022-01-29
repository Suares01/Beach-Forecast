import config from "config";
import pino from "pino";

import { ILoggerConfig } from "@config/types/configTypes";

const logger = config.get<ILoggerConfig>("App.logger");

export default pino<ILoggerConfig>({
  enabled: logger.enabled,
  level: logger.level,
});

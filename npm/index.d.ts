type DebugLevel = "trace" | "debug" | "info" | "warn" | "error";
type LoggerFunction = (...messages: any[]) => void;
interface Logger {
    trace: LoggerFunction;
    debug: LoggerFunction;
    info: LoggerFunction;
    warn: LoggerFunction;
    error: LoggerFunction;
    setLevel: (level: DebugLevel) => void;
}
declare const logger: Logger;
declare function createScopedLogger(scope: string): Logger;

export { type DebugLevel, createScopedLogger, logger };

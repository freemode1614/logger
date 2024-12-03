type DebugLevel = "trace" | "debug" | "info" | "warn" | "error";
type LoggerFunction = (...messages: any[]) => void;
interface LoggerMethods {
    trace: LoggerFunction;
    debug: LoggerFunction;
    info: LoggerFunction;
    warn: LoggerFunction;
    error: LoggerFunction;
    setLevel: (level: DebugLevel) => void;
}
declare const logger: LoggerMethods;
declare function createScopedLogger(scope: string): LoggerMethods;

export { type DebugLevel, type LoggerFunction, type LoggerMethods, createScopedLogger, logger };

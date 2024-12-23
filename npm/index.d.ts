type LoggerFunction = (...messages: unknown[]) => void;
declare enum levelPriority {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4
}
type DebugLevel = keyof typeof levelPriority;
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

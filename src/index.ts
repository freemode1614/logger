import chalk from "chalk";

export type LoggerFunction = (...messages: unknown[]) => void;

enum levelPriority {
  trace,
  debug,
  info,
  warn,
  error,
}

export type DebugLevel = keyof typeof levelPriority;

function setLevel(level: DebugLevel) {
  if ((level === "trace" || level === "debug") && PROD) {
    return;
  }

  currentLevel = level;
}

export interface LoggerMethods {
  trace: LoggerFunction;
  debug: LoggerFunction;
  info: LoggerFunction;
  warn: LoggerFunction;
  error: LoggerFunction;
  setLevel: (level: DebugLevel) => void;
}

const isBrowser = "HTMLElement" in globalThis;

// @ts-expect-error import.meta.env exisit in vite.
const DEV = isBrowser ? import.meta.env.DEV : process.env.NODE_ENV === "development";

// @ts-expect-error import.meta.env exisit in vite.
const PROD = isBrowser ? import.meta.PROD : process.env.NODE_ENV === "production";

let currentLevel: DebugLevel = DEV ? "debug" : "info";

const isWorker = "HTMLRewriter" in globalThis;
const supportsColor = !isWorker;

export const logger: LoggerMethods = {
  trace: (...messages: unknown[]) => log("trace", undefined, messages),
  debug: (...messages: unknown[]) => log("debug", undefined, messages),
  info: (...messages: unknown[]) => log("info", undefined, messages),
  warn: (...messages: unknown[]) => log("warn", undefined, messages),
  error: (...messages: unknown[]) => log("error", undefined, messages),
  setLevel,
};

/**
 * Create a custom logger with specified scope prefix.
 *
 * @param scope {string} prefix
 * @returns Logger {LoggerMethods}
 */
export function createScopedLogger(scope: string): LoggerMethods {
  return {
    trace: (...messages: unknown[]) => log("trace", scope, messages),
    debug: (...messages: unknown[]) => log("debug", scope, messages),
    info: (...messages: unknown[]) => log("info", scope, messages),
    warn: (...messages: unknown[]) => log("warn", scope, messages),
    error: (...messages: unknown[]) => log("error", scope, messages),
    setLevel,
  };
}

function log(level: DebugLevel, scope: string | undefined, messages: unknown[]) {
  if (levelPriority[level] < levelPriority[currentLevel]) return;

  const date = new Date();
  const timestamp = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour12: false });

  const formattedMessages = (messages as string[]).reduce((accumulator, current) => {
    if (typeof current === "object") {
      return accumulator + "\n" + JSON.stringify(current, undefined, 2);
    }

    if (accumulator.endsWith("\n")) {
      return accumulator + current;
    }

    if (!accumulator) {
      return current;
    }

    return `${accumulator} ${current}`;
  }, ``);

  if (!supportsColor) {
    console.log(`[${timestamp}] [${level.toUpperCase()}]`, formattedMessages);

    return;
  }

  const labelBackgroundColor = getColorForLevel(level);
  const labelTextColor = level === "warn" ? "#000000" : "#FFFFFF";

  // Browser Capability
  if (isBrowser) {
    const labelStyles = getLabelStyles(labelBackgroundColor, labelTextColor);
    const scopeStyles = getLabelStyles("#77828D", "#FFFFFF");

    const styles = [labelStyles];

    if (typeof scope === "string") {
      styles.push("", scopeStyles);
    }

    console.log(`[${timestamp}]%c${level.toUpperCase()}${scope ? `%c %c${scope}` : ""}`, ...styles, formattedMessages);
  } else {
    const labelStyled = getStyledLabel(labelBackgroundColor, labelTextColor, level.toUpperCase());
    const scopeStyled = getStyledLabel("#77828D", "white", scope);

    console.log(`[${timestamp}]`, labelStyled, scopeStyled, formattedMessages);
  }
}

function getLabelStyles(color: string, textColor: string) {
  return `background-color: ${color}; color: white; border: 4px solid ${color}; color: ${textColor}; `;
}

function getStyledLabel(bgColor: string, textColor: string, text?: string) {
  return text ? chalk.bgHex(bgColor).hex(textColor).bold(text) : "";
}

function getColorForLevel(level: DebugLevel): string {
  switch (level) {
    case "trace":
    case "debug": {
      return "#77828D";
    }
    case "info": {
      return "#1389FD";
    }
    case "warn": {
      return "#FFDB6C";
    }
    case "error": {
      return "#EE4744";
    }
    default: {
      return "#000000";
    }
  }
}

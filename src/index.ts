import chalk from "chalk";

export type DebugLevel = "trace" | "debug" | "info" | "warn" | "error";

export type LoggerFunction = (...messages: unknown[]) => void;

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

function setLevel(level: DebugLevel) {
  if ((level === "trace" || level === "debug") && PROD) {
    return;
  }

  currentLevel = level;
}

function log(level: DebugLevel, scope: string | undefined, messages: unknown[]) {
  const levelOrder: DebugLevel[] = ["trace", "debug", "info", "warn", "error"];

  if (levelOrder.indexOf(level) < levelOrder.indexOf(currentLevel)) {
    return;
  }

  const allMessages = (messages as string[]).reduce((accumulator, current) => {
    if (accumulator.endsWith("\n")) {
      return accumulator + current;
    }

    if (!accumulator) {
      return current;
    }

    return `${accumulator} ${current}`;
  }, "");

  if (!supportsColor) {
    console.log(`[${level.toUpperCase()}]`, allMessages);

    return;
  }

  const labelBackgroundColor = getColorForLevel(level);
  const labelTextColor = level === "warn" ? "#000000" : "#FFFFFF";

  if (isBrowser) {
    const labelStyles = getLabelStyles(labelBackgroundColor, labelTextColor);
    const scopeStyles = getLabelStyles("#77828D", "#FFFFFF");

    const styles = [labelStyles];

    if (typeof scope === "string") {
      styles.push("", scopeStyles);
    }

    console.log(`%c${level.toUpperCase()}${scope ? `%c %c${scope}` : ""}`, ...styles, allMessages);
  } else {
    const labelStyled = getStyledLabel(labelBackgroundColor, labelTextColor, level.toUpperCase());
    const scopeStyled = getStyledLabel("#77828D", "white", scope);

    console.log(labelStyled, scopeStyled, allMessages);
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

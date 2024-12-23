'use strict';

var chalk = require('chalk');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var chalk__default = /*#__PURE__*/_interopDefault(chalk);

// src/index.ts
var levelPriority = /* @__PURE__ */ ((levelPriority2) => {
  levelPriority2[levelPriority2["trace"] = 0] = "trace";
  levelPriority2[levelPriority2["debug"] = 1] = "debug";
  levelPriority2[levelPriority2["info"] = 2] = "info";
  levelPriority2[levelPriority2["warn"] = 3] = "warn";
  levelPriority2[levelPriority2["error"] = 4] = "error";
  return levelPriority2;
})(levelPriority || {});
function setLevel(level) {
  if ((level === "trace" || level === "debug") && PROD) {
    return;
  }
  currentLevel = level;
}
var isBrowser = "HTMLElement" in globalThis;
var DEV = isBrowser ? undefined.DEV : process.env.NODE_ENV === "development";
var PROD = isBrowser ? undefined : process.env.NODE_ENV === "production";
var currentLevel = DEV ? "debug" : "info";
var isWorker = "HTMLRewriter" in globalThis;
var supportsColor = !isWorker;
var logger = {
  trace: (...messages) => log("trace", void 0, messages),
  debug: (...messages) => log("debug", void 0, messages),
  info: (...messages) => log("info", void 0, messages),
  warn: (...messages) => log("warn", void 0, messages),
  error: (...messages) => log("error", void 0, messages),
  setLevel
};
function createScopedLogger(scope) {
  return {
    trace: (...messages) => log("trace", scope, messages),
    debug: (...messages) => log("debug", scope, messages),
    info: (...messages) => log("info", scope, messages),
    warn: (...messages) => log("warn", scope, messages),
    error: (...messages) => log("error", scope, messages),
    setLevel
  };
}
function log(level, scope, messages) {
  if (levelPriority[level] < levelPriority[currentLevel]) return;
  const date = /* @__PURE__ */ new Date();
  const timestamp = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour12: false });
  const formattedMessages = messages.reduce((accumulator, current) => {
    if (typeof current === "object") {
      return accumulator + "\n" + JSON.stringify(current, void 0, 2);
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
function getLabelStyles(color, textColor) {
  return `background-color: ${color}; color: white; border: 4px solid ${color}; color: ${textColor}; `;
}
function getStyledLabel(bgColor, textColor, text) {
  return text ? chalk__default.default.bgHex(bgColor).hex(textColor).bold(text) : "";
}
function getColorForLevel(level) {
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

exports.createScopedLogger = createScopedLogger;
exports.logger = logger;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map
import labelType from "@/utils/labels";

const logger = {
  info(...args: Parameters<typeof console.log>) {
    console.log(`\n${labelType.INFO}`, ...args);
  },

  warn(...args: Parameters<typeof console.warn>) {
    console.warn(`\n${labelType.WARN}`, ...args);
  },

  error(...args: Parameters<typeof console.error>) {
    console.error(`\n${labelType.ERROR}`, ...args);
  },

  debug(...args: Parameters<typeof console.log>) {
    console.log(`\n${labelType.DEBUG}`, ...args);
  },

  log(...args: Parameters<typeof console.log>) {
    console.log(...args);
  },
};

export default logger;

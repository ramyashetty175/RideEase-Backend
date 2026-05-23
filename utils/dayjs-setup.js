const dayjs = require("dayjs");

// Plugins
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const relativeTime = require("dayjs/plugin/relativeTime");

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Set default timezone (optional)
dayjs.tz.setDefault("Asia/Kolkata");

module.exports = dayjs;
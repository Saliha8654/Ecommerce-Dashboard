const WINSTON = require("winston");

const LOG_FORMAT = (file) => {
	return WINSTON.format.combine(
		WINSTON.format.align(),
		WINSTON.format.timestamp({ format: "DD-MM-YYYY T hh:mm:ss.sss A" }),
		WINSTON.format.label({ label: file }),
		WINSTON.format.printf(({ timestamp, level, message, label }) => {
			return `[ ${timestamp} | ${level.toUpperCase()} | LOG:${message} | ${label}]`;
		})
	);
};

const logger = (file) => {
	return WINSTON.createLogger({
		level: "debug",
		format: LOG_FORMAT(file),
		transports: [new WINSTON.transports.Console()],
	});
};

module.exports = logger;

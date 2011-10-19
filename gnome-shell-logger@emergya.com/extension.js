const Lang = imports.lang;
const Main = imports.ui.main;

const Extension = imports.ui.extensionSystem.extensions['gnome-shell-logger@emergya.com'];
const Log = Extension.log4javascript.log4javascript;
const GjsAppender = Extension.log4javascript_gjs_appender.GjsAppender;
const FileAppender = Extension.log4javascript_file_appender.FileAppender;

const LOG_FILE = '/tmp/gshell.log';
const LOGGER_NAME = 'gshell';
const LOGGER_LEVEL = Log.Level.DEBUG;
const APPENDER_PATTERN_GJS = '%-5p: %m';
const APPENDER_PATTERN_FILE = '%d{HH:mm:ss,SSS} %-5p [%c]: %m';

function init_logging() {

	let root_logger = Log.getLogger(LOGGER_NAME);
	root_logger.setLevel(LOGGER_LEVEL);

	let gjsAppender = new GjsAppender();
	gjsAppender.setLayout(new Log.PatternLayout(APPENDER_PATTERN_GJS));
	root_logger.addAppender(gjsAppender);

	let fileAppender = new FileAppender(LOG_FILE);
	fileAppender.setLayout(new Log.PatternLayout(APPENDER_PATTERN_FILE));
	root_logger.addAppender(fileAppender);

	global.logger = root_logger;
}

function init(meta) {
	try {

		init_logging();

		Main._log = function(category, msg) {

			let text = msg;
			if (arguments.length > 2) {
				text += ': ';
				for (let i = 2; i < arguments.length; i++) {
					text += JSON.stringify(arguments[i]);
					if (i < arguments.length - 1)
						text += ' ';
				}
			}

			let logItem = {timestamp: new Date().getTime(),
								 category: category,
								 message: text };

			let logger_method;
			try {
				logger_method = Lang.bind(global.logger, global.logger[logItem.category]);
				logger_method(logItem.message);
			} catch(e) {
				global.logger.info('[' + logItem.category + '] ' + logItem.message);
			}

			Main._errorLogStack.push(logItem);
		};

	} catch (e) {
		global.log(e);
		print("ERROR in log initialization: " + e);
	}
}

function enable() {}
function disable() {}

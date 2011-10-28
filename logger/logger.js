/**
 * logger.js
 * Copyright (C) 2011, Junta de Andalucía <devmaster@guadalinex.org>
 *
 * This file is part of Guadalinex
 *
 * This software is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * As a special exception, if you link this library with other files to
 * produce an executable, this library does not by itself cause the
 * resulting executable to be covered by the GNU General Public License.
 * This exception does not however invalidate any other reasons why the
 * executable file might be covered by the GNU General Public License.
 *
 * Author: Antonio Hernández <ahernandez@emergya.com>
 *
 */

const Lang = imports.lang;
const Main = imports.ui.main;

const Log = imports.logger.log4javascript.log4javascript;
const GjsAppender = imports.logger.log4javascript_gjs_appender.GjsAppender;
const FileAppender = imports.logger.log4javascript_file_appender.FileAppender;

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

function init() {
	try {

		init_logging();

		// Every message sended to global.log() will be sended also
		// to log4javascript.
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

init();

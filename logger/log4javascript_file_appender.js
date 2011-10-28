/**
 * Author: Tim Cuthbertson <tim@gfxmonk.net>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const log4javascript = imports.logger.log4javascript.log4javascript;
const Gio = imports.gi.Gio;

function FileAppender() {
	this.init.apply(this, arguments);
};

FileAppender.prototype = new log4javascript.Appender();
FileAppender.prototype.layout = new log4javascript.NullLayout();
FileAppender.prototype.threshold = log4javascript.Level.DEBUG;

FileAppender.prototype.init = function(filename) {
	this.filename = filename;
}

FileAppender.prototype.write = function() {
	// On first invocation, open the file.
	// Then replace the `write` function with the actual implementation.
	let f = Gio.file_new_for_path(this.filename);
	let stream = f.append_to(Gio.FileCreateFlags.NONE, null);
	let write = function(str) {
		str = str + "\n";
		stream.write(str, null);
	}
	this.write = write;
	write.apply(this, arguments);
}
FileAppender.prototype.append = function(loggingEvent) {
	var appender = this;

	var getFormattedMessage = function() {
		var layout = appender.getLayout();
		var formattedMessage = layout.format(loggingEvent);
		if (layout.ignoresThrowable() && loggingEvent.exception) {
			formattedMessage += "\n  " + loggingEvent.getThrowableStrRep();
		}
		return formattedMessage;
	};

	this.write(getFormattedMessage());
};

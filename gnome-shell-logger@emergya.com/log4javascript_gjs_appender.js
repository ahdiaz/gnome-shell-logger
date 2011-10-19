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

const Extension = imports.ui.extensionSystem.extensions['gnome-shell-logger@emergya.com'];
const log4javascript = Extension.log4javascript.log4javascript;

function GjsAppender() {};

GjsAppender.prototype = new log4javascript.Appender();
GjsAppender.prototype.layout = new log4javascript.NullLayout();
GjsAppender.prototype.threshold = log4javascript.Level.INFO;

GjsAppender.prototype.append = function(loggingEvent) {
	var appender = this;
	var getFormattedMessage = function() {
		var layout = appender.getLayout();
		var formattedMessage = layout.format(loggingEvent);
		if (layout.ignoresThrowable() && loggingEvent.exception) {
			formattedMessage += "\n  " + loggingEvent.getThrowableStrRep();
		}
		return formattedMessage;
	};

	print(getFormattedMessage());
};

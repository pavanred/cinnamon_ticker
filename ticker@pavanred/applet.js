/*
 *
 *  Cinnamon applet - ticker
 *
 *  Author
 *	 Pavan Reddy <pavankumar.kh@gmail.com>
 *
 * This file is part of ticker.
 *
 * ticker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ticker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ticker.  If not, see <http://www.gnu.org/licenses/>.
 */

/*------------------------
 * Imports
 * ------------------------*/
imports.searchPath.push( imports.ui.appletManager.appletMeta["ticker@pavanred"].path );

const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Applet = imports.ui.applet;
const Clutter = imports.gi.Clutter;
const Gettext = imports.gettext;
const _ = Gettext.gettext;
const Lang = imports.lang;
const AppletDir = imports.ui.appletManager.appletMeta['ticker@pavanred'].path;
const AppletMeta = imports.ui.appletManager.applets['ticker@pavanred'];
const Util = imports.misc.util;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Gtk = imports.gi.Gtk;

/*------------------------
 * Constants
 * ------------------------*/

const UUID = 'ticker@pavanred';

/*------------------------
 * Main
 * ------------------------*/
function main(metadata, orientation) {
	let myApplet = new MyApplet(orientation);
	return myApplet;
};

function MyApplet(orientation) {
	this._init(orientation);
}

MyApplet.prototype = {
	__proto__: Applet.TextIconApplet.prototype,

	_init: function(orientation) {
		Applet.TextIconApplet.prototype._init.call(this, orientation);
		
		this.startIndex = 0;
		this.displayLength = 30;
		this.text = '';
		this.tickerSpeed = 200; //ms
				
		try {

		    Mainloop.timeout_add(this.tickerSpeed, Lang.bind(this, this.change));
		}
		catch (e) {
			global.log("exception:"  + e);
		};
	},
	
	getDisplaySubstring: function() {
		try{
			
			var overflow = this.text.length - this.startIndex;
						
			if (overflow < this.displayLength){
				
				if(this.startIndex == this.text.length){
					this.startIndex = 0;
				}
				
				return test.substr(this.startIndex, overflow) + test.substr(0, this.displayLength - overflow);
			}
			
			return test.substr(this.startIndex, this.displayLength);
		}
		catch (e) {
			global.log("exception:"  + e);
		};	
    },
    
    change: function() {
        
		try{
			
			this.set_applet_label(this.getDisplaySubstring());			
			this.startIndex++;
	        Mainloop.timeout_add(this.tickerSpeed, Lang.bind(this, this.change));
		}
		catch (e) {
			global.log("exception:"  + e);
		};
    }
};




/*
 *
 *  Cinnamon applet - ticker
 *
 *  Author
 *	Pavan Reddy <pavankumar.kh@gmail.com>
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
const Settings = imports.ui.settings;
const Json = imports.gi.Json
const Soup = imports.gi.Soup

/*------------------------
 * Constants
 * ------------------------*/

const UUID = 'ticker@pavanred';
const CMD_SETTINGS = "cinnamon-settings applets " + UUID;
const LOADING_TEXT = 'Retrieving data...';
const STOCK_BASEURL = 'http://finance.google.com/finance/info?q=';

const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());

/*------------------------
 * Keys
 * ------------------------*/
const TICKER_SPEED = "ticker_speed";
const DISPLAY_LENGTH = "display_length";
const STOCKS = "stocks";
const REFRESH_INTERVAL = "stock_refresh_interval";

const KEYS = [
  TICKER_SPEED,
  DISPLAY_LENGTH,
  STOCKS,
  REFRESH_INTERVAL
]

function ticker(metadata, orientation, panelHeight, instanceId) {
	this.settings = new Settings.AppletSettings(this, UUID, instanceId)
	this._init(orientation, panelHeight, instanceId);
}

ticker.prototype = {
	__proto__: Applet.TextIconApplet.prototype,

	_init: function(orientation, panelHeight, instanceId) {
		
		Applet.TextIconApplet.prototype._init.call(this, orientation, panelHeight, instanceId);
		
		for (let k in KEYS) {
			let key = KEYS[k]
			let keyProp = "_" + key
			this.settings.bindProperty(Settings.BindingDirection.IN, key, keyProp, null, null)
		}

		this.set_applet_label(LOADING_TEXT);
		var url = STOCK_BASEURL + this._stocks;		
		this.getStockQuotesAsync(url, function(stockQuotes){
			try{
				global.log('in callback');
				global.log(stockQuotes.length);
			}
			catch (e) {
				global.log('ticker@pavanred : exception'  + e);
			};
		});
		//this.tick();
		
		/*try {
		    Mainloop.timeout_add(this._stock_refresh_interval, Lang.bind(this, this.getStockQuotesContent()));
		}
		catch (e) {
			global.log("exception:"  + e);
		};*/
	},
	
	getStockQuotesAsync: function(url, callback) {
		try{		
			let context = this;
		    let message = Soup.Message.new('GET', url);
		    global.log(url);
		    _httpSession.queue_message(message, function(session,message){
		    	global.log('The message status : ' + message.status_code);
		    	global.log('The message body : ' + message.response_body.data);
		    	
		    	if (message.status_code !== 200) {
					global.log('ticker@pavanred : error fetching stock quotes');
					return;
				}
		    	global.log('before parsing');
		    	var stockQuotes = Json.json_parse(message.response_body.data, null);	
		    	global.log(stockQuotes);
		    	callback.call(context, stockQuotes);
		    })
	    }
		catch (e) {
			global.log("ticker@pavanred : exception "  + e);
		};
	},
	
	/*getDisplaySubstring: function(display_string) {
		try{			
			var overflow = display_string.length - this.startIndex;						
			if (overflow < this._display_length){				
				if(this.startIndex == display_string.length){
					this.startIndex = 0;
					
				}
				return display_string.substr(this.startIndex, overflow) + display_string.substr(0, this._display_length - overflow);
			}			
			return display_string.substr(this.startIndex, this._display_length);
		}
		catch (e) {
			global.log("exception:"  + e);
		};	
    },*/
    
    tick: function() {
    	
    	this.set_applet_label(this.content);
    	
		/*try{
			if(this.content_contsruct != ''){
				this.display_content = this.content_construct;	
				this.content_contsruct = '';		
			}
			this.setDisplay();			
	        Mainloop.timeout_add(this._ticker_speed, Lang.bind(this, this.tick()));
		}
		catch (e) {
			global.log("exception:"  + e);
		};*/
    }
    
    /*setDisplay: function(){
		var displayString = this.getDisplaySubstring();		
		this.set_applet_label(displayString);
	}*/
};


/*------------------------
 * Main
 * ------------------------*/
function main(metadata, orientation, panelHeight, instanceId) {
	let myApplet = new ticker(metadata, orientation, panelHeight, instanceId);
	return myApplet;
};


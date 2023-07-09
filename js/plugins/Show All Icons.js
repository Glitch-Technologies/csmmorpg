////////////////////////////////////////
//        ICON SCALING SCRIPT         //
//         for RPG Maker MV           //
//           Version 1.0              //
//  by Jason "Wavelength" Commander   //
////////////////////////////////////////

// By default, only a few state icons can be shown at once.  This script will scale down the icons'
// display size by a factor of your choice if there are too many to display at full size, so that
// players can be aware of all of the states that are currently affecting their actors.

// TERMS OF USE
// You may use this script for your commercial or noncommercial RPG Maker games.
// You must credit me in your game or documentation (as Jason Commander or as Wavelength).
// For any other use of this script besides inclusion in an RPG Maker game, contact me.
// Thanks!


// This value can be changed to determine how much to scale down the icons when there are too many to
// display at full size.  For example, a value of 2 will reduce width and height by half.
Game_Party.ICON_SCALE = 2;


/*:
*
* @plugindesc This script sizes status icons down when there are too many to display at full size.
* @author Jason "Wavelength" Commander
* @help By opening the script in a text editor,
you can change the amount that icons will scale.
* 
* By default, they will scale to half size when
* there are too many icons to display at full size.
*
*/



Window_Base.prototype.drawSmallIcon = function(iconIndex, x, y) {
	var scaler = Game_Party.ICON_SCALE;
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth / scaler;
    var ph = Window_Base._iconHeight / scaler;
    var sx = iconIndex % 16 * (pw * scaler);
    var sy = Math.floor(iconIndex / 16) * (ph * scaler);
    this.contents.blt(bitmap, sx, sy, pw * scaler, ph * scaler, x, y,
    		Window_Base._iconWidth / scaler, Window_Base._iconHeight / scaler);
};

Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    too_big = false;
    if (actor.allIcons().length > Math.floor(width / Window_Base._iconWidth)) {
    	too_big = true;
    }
    if (too_big === false) {
    	var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
	    for (var i = 0; i < icons.length; i++) {
	        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
	    }
	} else {
		var scaler = Game_Party.ICON_SCALE;
		row_size = (Math.floor(width / (Window_Base._iconWidth / scaler)));
		rows_needed = Math.floor((actor.allIcons().length - 1) / row_size) + 1;
		for (j = 0; j < rows_needed; j++) {
			var icons = actor.allIcons().slice(0,
					Math.floor(width / (Window_Base._iconWidth / (scaler * scaler))));
		    for (var i = 0; i < row_size; i++) {
		        this.drawSmallIcon(icons[(j * row_size + i)],
		        		x + ((Window_Base._iconWidth / scaler) * (i % row_size)),
		        		y + (j * (Window_Base._iconHeight / scaler)) + 2);
		        if (((j * row_size) + i + 1) >= actor.allIcons().length) {
		        	break;
		        }
			}
		}
	}
};
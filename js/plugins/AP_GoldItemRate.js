//=============================================================================
// Alistair Plugins - Gold and Item Rates
// AP_GoldItemRate.js
//=============================================================================
var Imported = Imported || {};
Imported.AP_GoldItemRate = true;
//=============================================================================
 /*:
 * @plugindesc v1.01a Allows altering Gold rate and Drop rate more precisely.
 * @author Alistair Plugins
 *
 * @param Gold Rate Formula
 * @desc A custom gold rate formula for you to use. Use v[x] for variables and s[x] for switches. n is the default gold rate (with modifications).
 * @default n
 *
 * @param Item Rate Formula
 * @desc A custom drop rate formula for you to use. Use v[x] for variables and s[x] for switches. n is the default drop rate (with modifications).
 * @default n
 *
 * @param Default Gold Rate
 * @desc The default Gold Rate the game starts with. 1 = 100%, 0.5 = 50%, ... Default: 1
 * @default 1
 *
 * @param Default Item Rate
 * @desc The default Drop Rate the game starts with. 1 = 100%, 0.5 = 50%, ... Default: 1
 * @default 1
 *
 * @param Maximum Gold Rate
 * @desc The maximum Gold Rate possible. Default: 10
 * @default 10
 *
 * @param Maximum Item Rate
 * @desc The maximum Drop Rate possible. Default: 10
 * @default 10
 *
 * @help
 * ============================================================================
 * Alistair Plugins - Gold and Item Rates
 * ============================================================================
 * 
 * With this plugin you can have exact rates for Gold and Item Drops.
 * The editor by default only allows for "Double Gold" and 
 * "Double Item Drop Rates".
 *
 * A few words concerning the custom formulas:
 * Use v[x] to refer to the value stored in variable x.
 *
 * Use s[x] to refer to the value stored in switch x. Useful for 
 * making a conditional formula.
 *
 * n is the value that you defined in "Default Gold Rate" 
 * or "Default Item Rate".
 * Please note: n is also the value that will be modified through notetags.
 * Example: Default Gold Rate = 1. That means n = 1. But now you have a
 * piece of equipment that gives +50% gold rate, meaning n will be altered!
 * n will be 1.5 after that. So you should take these changes into consideration
 * when using a custom formula!
 *
 * Place this below all of Yanfly's Scripts or it MAY NOT work.
 * ============================================================================
 * Notetags
 * ============================================================================
 * These only work for: Actors, Classes, Weapons, Armours, States
 *
 * ▼ ADDITIVE NOTETAGS ▼
 * <Gold Rate: +x%>
 * <Gold Rate: -x%>
 * Will increase or decrease the total rate by flat x%.
 *
 * <Item Rate: +x%>
 * <Item Rate: -x%>
 * Will increase or decrease the total rate by flat x%.
 *
 * Note: These alterations stack additively! This means that 
 *		 twice +75% will result in +150%.
 *
 * ▼ MULTIPLICATIVE NOTETAGS ▼
 * <Gold Rate: x%>
 * Will multiply the current rate with x.
 *
 * <Item Rate: x%>
 * Will multiply the current rate with x.
 *
 * Note: These alterations stack multiplicatively! This means that 
 *		 twice 75% will result in 56%.
 *
 * Note: The alterations to the final rate will be calculated
 * in this very order. First the additive changes are made and after that
 * the multiplicative changes are applied.
 *
 * ============================================================================
 * Update History
 * ============================================================================
 * V1.01a
 * - Updated the notetags and added multiplicative versions
 * - Fixed gold rounding errors
 *
 * V1.0
 * - First version
 */
//=============================================================================

(function() {
// Parameters
var parameters = PluginManager.parameters('AP_GoldItemRate');
var DefaultGoldRate = Number(parameters['Default Gold Rate']);
var DefaultDropRate = Number(parameters['Default Item Rate']);
var MaximumGoldRate = Number(parameters['Maximum Gold Rate']);
var MaximumDropRate = Number(parameters['Maximum Item Rate']);
var GoldFormula     = String(parameters['Gold Rate Formula']);
var ItemFormula     = String(parameters['Item Rate Formula']);

// RegExp Handling
AP_GoldDropRate_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
	if (!AP_GoldDropRate_DataManager_isDatabaseLoaded.call(this)) return false;
	this.processAPGDRN1($dataActors);
	this.processAPGDRN1($dataClasses);
	this.processAPGDRN1($dataWeapons);
	this.processAPGDRN1($dataArmors);
	this.processAPGDRN1($dataStates);
	return true;
}

DataManager.processAPGDRN1 = function(dataGroup) {
	var APGDRN1_1 = /<(?:Gold Rate):[ ]([+-]\d+)%>/i;
	var APGDRN1_2 = /<(?:Item Rate):[ ]([+-]\d+)%>/i;
	var APGDRN1_3 = /<(?:Gold Rate):[ ](\d+)%>/i;
	var APGDRN1_4 = /<(?:Item Rate):[ ](\d+)%>/i;
	for (var i = 1; i < dataGroup.length; i++) {
		var object = dataGroup[i];
		var noteData = object.note.split(/[\r\n]+/);

		object.goldFlat = 0;
		object.itemFlat = 0;
		object.goldRate = 1;
		object.itemRate = 1;

		for (var n = 0; n < noteData.length; n++) {
			var line = noteData[n];
			if (line.match(APGDRN1_1)) {
				object.goldFlat += parseFloat(RegExp.$1 * 0.01);
			} else if (line.match(APGDRN1_2)) {
				object.itemFlat += parseFloat(RegExp.$1 * 0.01);
			} else if (line.match(APGDRN1_3)) {
				object.goldRate *= parseFloat(RegExp.$1 * 0.01);
			} else if (line.match(APGDRN1_4)) {
				object.itemRate *= parseFloat(RegExp.$1 * 0.01);
			};
		};
	};
};

Game_Enemy.prototype.dropItemRate = function() {
	var n = DefaultDropRate;
	var v = $gameVariables._data;
	var s = $gameSwitches._data;
	// Additive
	for (var i = 0; i < $gameParty.members().length; i++) {
		var actor = $gameParty.members()[i];
		n += $dataActors[actor._actorId].itemFlat;
		n += actor.currentClass().itemFlat;
		// Weapons & Armours
		for (var j = 0; j < actor.equips().length; j++) {
			var equip = actor.equips()[j];
			if (equip) n += equip.itemFlat;
		};
		// States
		for (var k = 0; k < actor.states().length; k++) {
			var state = actor.states()[k];
			if (state) n += state.itemFlat;
		};
	};
	// Multiplicative
	for (var i = 0; i < $gameParty.members().length; i++) {
		var actor = $gameParty.members()[i];
		n *= $dataActors[actor._actorId].itemRate;
		n *= actor.currentClass().itemRate;
		// Weapons & Armours
		for (var j = 0; j < actor.equips().length; j++) {
			var equip = actor.equips()[j];
			if (equip) n *= equip.itemRate;
		};
		// States
		for (var k = 0; k < actor.states().length; k++) {
			var state = actor.states()[k];
			if (state) n *= state.itemRate;
		};
	};

	var formula = eval(ItemFormula);
	formula = Math.min(formula, MaximumDropRate);
    return $gameParty.hasDropItemDouble() ? formula * 2 : formula;
};

Game_Troop.prototype.goldRate = function() {
	var n = DefaultGoldRate;
	var v = $gameVariables._data;
	var s = $gameSwitches._data;
	// Additive
	for (var i = 0; i < $gameParty.members().length; i++) {
		var actor = $gameParty.members()[i];
		n += $dataActors[actor._actorId].goldFlat;
		n += actor.currentClass().goldFlat;
		// Weapons & Armours
		for (var j = 0; j < actor.equips().length; j++) {
			var equip = actor.equips()[j];
			if (equip) n += equip.goldFlat;
		};
		// States
		for (var k = 0; k < actor.states().length; k++) {
			var state = actor.states()[k];
			if (state) n += state.goldFlat;
		};
	};
	// Multiplicative
	for (var i = 0; i < $gameParty.members().length; i++) {
		var actor = $gameParty.members()[i];
		n *= $dataActors[actor._actorId].goldRate;
		n *= actor.currentClass().goldRate;
		// Weapons & Armours
		for (var j = 0; j < actor.equips().length; j++) {
			var equip = actor.equips()[j];
			if (equip) n *= equip.goldRate;
		};
		// States
		for (var k = 0; k < actor.states().length; k++) {
			var state = actor.states()[k];
			if (state) n *= state.goldRate;
		};
	};

	var formula = eval(GoldFormula);
	formula = Math.min(formula, MaximumGoldRate);
    return $gameParty.hasGoldDouble() ? formula * 2 : formula;
};

Game_Troop.prototype.goldTotal = function() {
    return Math.round(this.deadMembers().reduce(function(r, enemy) {
        return r + enemy.gold();
    }, 0) * this.goldRate());
};

})();
//=============================================================================
// End of Plugin
//=============================================================================

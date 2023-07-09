//=============================================================================
// RPG Maker MZ - Remove  Party Command Window Prior to Battle
//=============================================================================

/*:
* @target MZ
* @plugindesc Removes opening party command window prior to battle.
* @author Script by Accendor, Wrapped by Lady JJ
* https://forums.rpgmakerweb.com/index.php?threads/skip-the-fight-escape-menu-at-the-start-of-each-rund-while-battles.58329/
* Response #5
*
* @help RemovePartyCommandWindowPriorToBattle.js
*
* This plugin provides a command to remove the party command window prior to battle.
*
* Plug and Play
* There are no commands
* Compatible with both MV and MZ
*
*/

var SceneBattlePartyCommand = Scene_Battle.prototype.startPartyCommandSelection;
Scene_Battle.prototype.startPartyCommandSelection = function() {
    SceneBattlePartyCommand.call(this);
    this.selectNextCommand();
    this._helpWindow.clear();
    this._partyCommandWindow.deactivate();
};
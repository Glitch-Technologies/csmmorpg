(function() {
    var addItemCommand = Window_ActorCommand.prototype.addItemCommand;
    Window_ActorCommand.prototype.addItemCommand = function() {
        if (!$gameSwitches.value(163)) { addItemCommand.call(this) }
    }
})();
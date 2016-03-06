var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var baseBO_1 = require("./baseBO");
/**
* Created by trevor on 1/13/16.
*/
var sql = {
    update: "UPDATE `gameAnalytics`.`game` SET `name` = %s, `link` = %s WHERE `id` = %d;",
    insert: "INSERT INTO `gameAnalytics`.`game` (`id`, `name`, `link`) VALUES (UUID(), %s, %s;"
};
var Game = (function (_super) {
    __extends(Game, _super);
    function Game(data) {
        _super.call(this);
        if (data == undefined || null)
            return;
        this.id = data.id;
        this.name = data.name;
        this.link = data.link;
    }
    Game.prototype.log = function () {
        console.log("game - " + this.name);
    };
    return Game;
})(baseBO_1.baseBO);
exports.Game = Game;
//# sourceMappingURL=game.js.map
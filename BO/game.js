var sql = {
    update: "UPDATE `gameAnalytics`.`game` SET `name` = %s, `link` = %s WHERE `id` = %d;",
    insert: "INSERT INTO `gameAnalytics`.`game` (`id`, `name`, `link`) VALUES (UUID(), %s, %s;"
};
var Game = (function () {
    function Game(data) {
        this.id = data.id;
        this.name = data.name;
        this.link = data.link;
    }
    return Game;
})();
module.exports = Game;
//# sourceMappingURL=game.js.map
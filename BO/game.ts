/**
* Created by trevor on 1/13/16.
*/
declare function require(name:string);
declare var module;

var sql = {
    update: "UPDATE `gameAnalytics`.`game` SET `name` = %s, `link` = %s WHERE `id` = %d;",
    insert: "INSERT INTO `gameAnalytics`.`game` (`id`, `name`, `link`) VALUES (UUID(), %s, %s;"
};

class Game {
    id: number;
    name: string;
    link: string;

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.link = data.link;
    }
    //getEvents(
}

module.exports = Game;
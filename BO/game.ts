import {baseBO} from "./baseBO";
/**
* Created by trevor on 1/13/16.
*/

var sql = {
    update: "UPDATE `gameAnalytics`.`game` SET `name` = %s, `link` = %s WHERE `id` = %d;",
    insert: "INSERT INTO `gameAnalytics`.`game` (`id`, `name`, `link`) VALUES (UUID(), %s, %s;"
};

interface IGame {
    name: string;
    link: string;
}

export class Game extends baseBO implements IGame{
    name: string;
    link: string;
    constructor(data:Game) {
        super();
        if(data == undefined || null)
            return;

        this.id = data.id;
        this.name = data.name;
        this.link = data.link;
    }

    log(){
        console.log("game - " + this.name);
    }
}

import {baseBO} from "./baseBO";
/**
* Created by trevor on 1/13/16.
*/

var strFormat = require('string-format');
var dateFormatLib = require('dateformat');

interface ITeam {
    externalName:string;
    name:string;
    parentTeamID:string;
    alternateName:string;
    country:string;
    active:boolean;
    liquidUrl:string;
    url:string;
    externalID:number;
}

export class Team extends baseBO implements ITeam{
    externalName:string;
    name:string;
    parentTeamID:string;
    alternateName:string;
    country:string;
    active:boolean;
    liquidUrl:string;
    url:string;
    externalID:number;

    public static get sql() {
        return {
            update: "UPDATE `gameAnalytics`.`match`SET`externalID`=%s,`startDate`=%d,`score1`=%d,`score2`=%d,`winner`=%d>,`time`=%s,`team1`=%s,`team2`=%s WHERE`id`=%s;",
            insert: "INSERT INTO `gameAnalytics`.`match`(`id`,`externalID`,`startDate`,`score1`,`score2`,`winner`,`time`,`team1`,`team2`)VALUES(UUID(),{0},'{1}',{2},{3},{4},{5},'{6}','{7}');"
        };
    }
    constructor() {
        super();
    }

    copy(data:Team) {
        this.constructor();
        if(data == undefined || null)
            return;
        this.id = data.id;
        this.externalName = data.externalName;
        this.name = data.name;
        this.parentTeamID = data.parentTeamID;
        this.alternateName = data.alternateName;
        this.country = data.country;
        this.active = data.active;
        this.liquidUrl = data.liquidUrl;
    }

    static getFromID(identifier:string):Team {
        return new Team();
    }

    log(){
        console.log("team - [" + this.name + "]");
    }

}

import {baseBO} from "./baseBO";
import {Team} from "./team";
/**
* Created by trevor on 1/13/16.
*/

var strFormat = require('string-format');
var dateFormatLib = require('dateformat');

interface IMatch {
    externalID:number;
    startDate:Date;
    score1:number;
    score2:number;
    winner:boolean;
    time:number;
    team1ID:string;
    team2ID:string;
    url:string;
}

export class Match extends baseBO implements IMatch{
    externalID:number;
    startDate:Date;
    score1:number;
    score2:number;
    winner:boolean;
    time:number;
    team1ID:string;
    team2ID:string;
    url:string;

    public static get sql() {
        return {
            update: "UPDATE `gameAnalytics`.`match`SET`externalID`=%s,`startDate`=%d,`score1`=%d,`score2`=%d,`winner`=%d>,`time`=%s,`team1`=%s,`team2`=%s WHERE`id`=%s;",
            insert: "INSERT INTO `gameAnalytics`.`match`(`id`,`externalID`,`startDate`,`score1`,`score2`,`winner`,`time`,`team1`,`team2`)VALUES(UUID(),{0},'{1}',{2},{3},{4},{5},'{6}','{7}');"
        };
    };

    constructor() {
        super();
    };

    copy(data:Match) {
        this.constructor();
        if(data == undefined || null)
            return;
        this.id = data.id;
        this.externalID = data.externalID;
        this.startDate = data.startDate;
        this.score1 = data.score1;
        this.score2 = data.score2;
        this.winner = data.winner;
        this.time = data.time;
        this.team1ID = data.team1ID;
        this.team2ID = data.team2ID;
    };

    getTeam1():Team {
        return Team.getFromID(this.team1ID);
    };

    getTeam2():Team {
        return new Team();
    };

    log(){
        console.log("match - [" + this.getTeam1().name + " vs. " + this.getTeam2().name + " ]");
    };

}

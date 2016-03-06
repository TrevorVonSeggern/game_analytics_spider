/**
 * Created by trevor on 1/13/16.
 */
/// <reference path="../typings/tsd.d.ts" />
import {baseBO} from "./baseBO";
import {Games} from "./games";
import {Connection} from "../sql/sqlHelper";
import {Game} from "./game";
var gamesLib = Games;
var guid = require('guid');
var strFormat = require('string-format');
var dateFormatLib = require('dateformat');

export class Tournament extends baseBO {
    name:string;
    url:string;
    startDate:Date;
    endDate:Date;
    status:number;
    gameID:string;

    constructor() {
        super();
        this.name = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.status = 0;
        this.gameID = '';
    }

    getGame(gameCallback:(game:Game) => void):void {
        gamesLib.getOne(this.gameID, gameCallback);
    }

    save(connection:Connection, callback:(param:any) => any): void {
        // validate
        if (this.name === ''
            || this.url === ''
            || this.startDate === null
            || this.startDate === undefined
            || this.endDate === null
            || this.endDate === undefined
            || this.gameID === '') {
            return;
        }
        var query: any;
        if (this.id == '') {
            this.id = guid.create();
            query = this.getInsertQuery();
        } else {
            query = this.getUpdateQuery();
        }
        Connection.addQueryToPool(query, callback);
    }

    log() {
        console.log("Tournament - id: " + this.id);
    }

    public static get sql(){
        return {
            update: "UPDATE `gameAnalytics`.`event`SET`name`=`%s`,`url`=`%s`,`startDate`=`%s`,`endDate`=`%s`,`status`=`%d`,`gameID`=`%s` WHERE`id`=`%s`;",
            insert: "INSERT INTO `gameAnalytics`.`event`(`id`,`name`,`url`,`startDate`,`endDate`,`status`,`gameID`)VALUES(UUID(),'{0}','{1}','{2}','{3}',{4},'{5}');"
        };
    }

    getUpdateQuery():string {
        return strFormat(Tournament.sql.update, this.name, this.url, this.startDate, this.endDate, this.status, this.gameID, this.id);
    }

    getInsertQuery():string {
        return strFormat(Tournament.sql.insert, this.name, this.url, Tournament.dateFormat(this.startDate), Tournament.dateFormat(this.endDate), this.status, this.gameID);
    }

    static dateFormat(date:Date) {
        return dateFormatLib(date, "yyyy-mm-dd");
    }

}

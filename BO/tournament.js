var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by trevor on 1/13/16.
 */
/// <reference path="../typings/tsd.d.ts" />
var baseBO_1 = require("./baseBO");
var games_1 = require("./games");
var sqlHelper_1 = require("../sql/sqlHelper");
var gamesLib = games_1.Games;
var guid = require('guid');
var strFormat = require('string-format');
var dateFormatLib = require('dateformat');
var Tournament = (function (_super) {
    __extends(Tournament, _super);
    function Tournament() {
        _super.call(this);
        this.name = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.status = 0;
        this.gameID = '';
    }
    Tournament.prototype.getGame = function (gameCallback) {
        gamesLib.getOne(this.gameID, gameCallback);
    };
    Tournament.prototype.save = function (connection, callback) {
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
        var query;
        if (this.id == '') {
            this.id = guid.create();
            query = this.getInsertQuery();
        }
        else {
            query = this.getUpdateQuery();
        }
        sqlHelper_1.Connection.addQueryToPool(query, callback);
    };
    Tournament.prototype.log = function () {
        console.log("Tournament - id: " + this.id);
    };
    Object.defineProperty(Tournament, "sql", {
        get: function () {
            return {
                update: "UPDATE `gameAnalytics`.`event`SET`name`=`%s`,`url`=`%s`,`startDate`=`%s`,`endDate`=`%s`,`status`=`%d`,`gameID`=`%s` WHERE`id`=`%s`;",
                insert: "INSERT INTO `gameAnalytics`.`event`(`id`,`name`,`url`,`startDate`,`endDate`,`status`,`gameID`)VALUES(UUID(),'{0}','{1}','{2}','{3}',{4},'{5}');"
            };
        },
        enumerable: true,
        configurable: true
    });
    Tournament.prototype.getUpdateQuery = function () {
        return strFormat(Tournament.sql.update, this.name, this.url, this.startDate, this.endDate, this.status, this.gameID, this.id);
    };
    Tournament.prototype.getInsertQuery = function () {
        return strFormat(Tournament.sql.insert, this.name, this.url, Tournament.dateFormat(this.startDate), Tournament.dateFormat(this.endDate), this.status, this.gameID);
    };
    Tournament.dateFormat = function (date) {
        return dateFormatLib(date, "yyyy-mm-dd");
    };
    return Tournament;
})(baseBO_1.baseBO);
exports.Tournament = Tournament;
//# sourceMappingURL=tournament.js.map
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var baseBO_1 = require("./baseBO");
var team_1 = require("./team");
/**
* Created by trevor on 1/13/16.
*/
var strFormat = require('string-format');
var dateFormatLib = require('dateformat');
var Match = (function (_super) {
    __extends(Match, _super);
    function Match() {
        _super.call(this);
    }
    Object.defineProperty(Match, "sql", {
        get: function () {
            return {
                update: "UPDATE `gameAnalytics`.`match`SET`externalID`=%s,`startDate`=%d,`score1`=%d,`score2`=%d,`winner`=%d>,`time`=%s,`team1`=%s,`team2`=%s WHERE`id`=%s;",
                insert: "INSERT INTO `gameAnalytics`.`match`(`id`,`externalID`,`startDate`,`score1`,`score2`,`winner`,`time`,`team1`,`team2`)VALUES(UUID(),{0},'{1}',{2},{3},{4},{5},'{6}','{7}');"
            };
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Match.prototype.copy = function (data) {
        this.constructor();
        if (data == undefined || null)
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
    ;
    Match.prototype.getTeam1 = function () {
        return team_1.Team.getFromID(this.team1ID);
    };
    ;
    Match.prototype.getTeam2 = function () {
        return new team_1.Team();
    };
    ;
    Match.prototype.log = function () {
        console.log("match - [" + this.getTeam1().name + " vs. " + this.getTeam2().name + " ]");
    };
    ;
    return Match;
})(baseBO_1.baseBO);
exports.Match = Match;
//# sourceMappingURL=match.js.map
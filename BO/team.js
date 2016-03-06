var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var baseBO_1 = require("./baseBO");
/**
* Created by trevor on 1/13/16.
*/
var strFormat = require('string-format');
var dateFormatLib = require('dateformat');
var Team = (function (_super) {
    __extends(Team, _super);
    function Team() {
        _super.call(this);
    }
    Object.defineProperty(Team, "sql", {
        get: function () {
            return {
                update: "UPDATE `gameAnalytics`.`match`SET`externalID`=%s,`startDate`=%d,`score1`=%d,`score2`=%d,`winner`=%d>,`time`=%s,`team1`=%s,`team2`=%s WHERE`id`=%s;",
                insert: "INSERT INTO `gameAnalytics`.`match`(`id`,`externalID`,`startDate`,`score1`,`score2`,`winner`,`time`,`team1`,`team2`)VALUES(UUID(),{0},'{1}',{2},{3},{4},{5},'{6}','{7}');"
            };
        },
        enumerable: true,
        configurable: true
    });
    Team.prototype.copy = function (data) {
        this.constructor();
        if (data == undefined || null)
            return;
        this.id = data.id;
        this.externalName = data.externalName;
        this.name = data.name;
        this.parentTeamID = data.parentTeamID;
        this.alternateName = data.alternateName;
        this.country = data.country;
        this.active = data.active;
        this.liquidUrl = data.liquidUrl;
    };
    Team.getFromID = function (identifier) {
        return new Team();
    };
    Team.prototype.log = function () {
        console.log("team - [" + this.name + "]");
    };
    return Team;
})(baseBO_1.baseBO);
exports.Team = Team;
//# sourceMappingURL=team.js.map
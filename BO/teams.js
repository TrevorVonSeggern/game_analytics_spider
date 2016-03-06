/**
* Created by trevor on 1/13/16.
*/
var hash = require("hashtable");
var Teams = (function () {
    function Teams() {
        this.teamTable = new hash();
        this.waitingTable = new hash();
        this.waitingTable.reserve(500);
    }
    Teams.prototype.log = function () {
        this.teamTable.forEach(function (c, key, value) {
            value.log();
        });
    };
    Teams.prototype.waitOnTeam = function (externalID, callback) {
        if (this.waitingTable.has(externalID)) {
            callback(this.waitingTable.get(externalID));
            this.waitingTable.remove(externalID);
        }
        else {
            this.waitingTable.add(externalID, callback);
        }
    };
    Teams.prototype.add = function (team) {
        if (this.waitingTable.has(team.externalID)) {
            this.waitingTable.get(team.externalID)(team);
            this.waitingTable.remove(team.externalID);
        }
        this.teamTable.put(team.alternateName, team);
    };
    Teams.prototype.reserve = function (size) {
        this.teamTable.reserve(size);
    };
    return Teams;
})();
exports.Teams = Teams;
//# sourceMappingURL=teams.js.map
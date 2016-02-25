var util = require('util');
var gamesLib = require('./games.js');
var strFormat = require('string-format');
var dateFormatLib = require('dateformat');
var sql = {
    update: "UPDATE `gameAnalytics`.`event`SET`name`=`%s`,`url`=`%s`,`startDate`=`%s`,`endDate`=`%s`,`status`=`%d`,`internalStatus`=`%d`,`gameID`=`%s` WHERE`id`=`%s`;",
    insert: "INSERT INTO `gameAnalytics`.`event`(`id`,`name`,`url`,`startDate`,`endDate`,`status`,`internalStatus`,`gameID`)VALUES(UUID(),'{0}','{1}','{2}','{3}',{4},{5},'{6}');"
};
function getInsertQuery(vm) {
    var result = strFormat(sql.insert, vm.name, vm.url, dateFormat(vm.startDate), dateFormat(vm.endDate), vm.status, vm.internalStatus, vm.gameID);
    return result;
}
function getUpdateQuery(vm) {
    return strFormat(sql.update, vm.name, vm.url, vm.startDate, vm.endDate, vm.status, vm.internalStatus, vm.gameID, vm.id);
}
function dateFormat(date) {
    return dateFormatLib(date, "yyyy-mm-dd");
}
var EventClass = (function () {
    function EventClass() {
        this.id = '';
        this.name = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.status = 0;
        this.internalStatus = 0;
        this.gameID = '';
    }
    EventClass.prototype.getGame = function (gameCallback) {
        return gamesLib.getOne(this.gameID, gameCallback);
    };
    EventClass.prototype.save = function (connection, callback) {
        if (this.name === ''
            || this.url === ''
            || this.startDate === null
            || this.startDate === undefined
            || this.endDate === null
            || this.endDate === undefined
            || this.gameID === '') {
            return false;
        }
        var query;
        if (this.id == '') {
            this.id = require('guid').create();
            query = getInsertQuery(this);
        }
        else {
            query = getUpdateQuery(this);
        }
        connection.addQueryToPool(query, callback);
    };
    return EventClass;
})();
exports.EventClass = EventClass;
//# sourceMappingURL=event.js.map
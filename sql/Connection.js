/**
 * Created by trevor on 1/13/16.
 */
var mysql = require('mysql');
var settings = require('../connection.json');
var Connection = (function () {
    function Connection() {
        this.requestPool = [];
    }
    Connection.format = function (query, inserts) {
        return mysql.format(query, inserts);
    };
    Connection.prototype.query = function (query, queryCallback) {
        this.connection.query(query, queryCallback);
    };
    Connection.executeQueryRequestOnConnection = function (mysqlCon, requestPool, finishedCallback) {
        // ran out of requests
        if (requestPool == undefined || requestPool == null || requestPool == [] || requestPool.length <= 0) {
            finishedCallback();
            return;
        }
        var request = requestPool.shift();
        // process a request
        mysqlCon.query(request.query, function () {
            request.callback();
            if (requestPool.length == 0) {
                finishedCallback();
            }
            else {
                Connection.executeQueryRequestOnConnection(mysqlCon, requestPool, finishedCallback);
            }
        });
    };
    Connection.prototype.executePool = function (savedAllCallback) {
        if (this.requestPool == undefined || this.requestPool.length == undefined || this.requestPool.length <= 0) {
            return; // don't bother if there aren't any queries
        }
        if (Connection.pool == undefined) {
            Connection.pool = mysql.createPool(settings); // create pool.
        }
        var connections_to_create = (settings.connectionLimit - Connection.poolActiveConnections);
        for (var c = 0; c < connections_to_create; c++) {
            Connection.pool.getConnection(function (error, mysqlCon) {
                if (error) {
                    mysqlCon && mysqlCon.release();
                    console.log(error);
                    return;
                }
                Connection.poolActiveConnections++;
                Connection.executeQueryRequestOnConnection(mysqlCon, this.requestPool, function () {
                    Connection.poolActiveConnections--;
                    mysqlCon.release();
                    savedAllCallback();
                });
            });
        }
    };
    Connection.pool = undefined;
    Connection.poolActiveConnections = 0;
    return Connection;
})();
exports.Connection = Connection;
//# sourceMappingURL=sqlHelper.js.map
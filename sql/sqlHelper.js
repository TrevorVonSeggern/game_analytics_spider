/**
 * Created by trevor on 1/13/16.
 */
var mysql = require('mysql');
var poolRequests = [];
var settings = require('../connection.json');
var Connection = (function () {
    function Connection() {
    }
    Connection.format = function (query, inserts) {
        return mysql.format(query, inserts);
    };
    Connection.prototype.query = function (query, queryCallback) {
        this.connection.query(query, queryCallback);
    };
    Connection.prototype.createConnection = function () {
        this.connection = mysql.createConnection(settings);
        this.connection.connect();
    };
    Connection.addQueryToPool = function (query, callback) {
        poolRequests.push({ query: query, callback: callback });
    };
    Connection.prototype.executePool = function (savedAllCallback) {
        if (poolRequests && poolRequests.length && poolRequests.length <= 0)
            return; // don't bother if there aren't any queries
        this.pool = mysql.createPool(settings); // create pool.
        var requestsLeft = poolRequests.length;
        // only needs one connection because the data amount doesn't justify it.
        if (poolRequests.length < 10) {
            this.createConnection();
            while (poolRequests.length > 0) {
                var sqlItem = poolRequests.shift();
                this.query(sqlItem.query, function () {
                    requestsLeft--;
                    sqlItem.callback();
                    if (requestsLeft == 0) {
                        savedAllCallback();
                    }
                });
            }
            this.killConnection();
        }
        else {
            for (var c = 0; c < settings.connectionLimit; c++) {
                this.pool.getConnection(function (error, mysqlCon) {
                    if (error) {
                        mysqlCon && mysqlCon.release();
                        console.log(error);
                        return;
                    }
                    function executeQueryRequestOnConnection(mysqlCon, request) {
                        // ran out of requests
                        if (request == undefined || request == null || request == {}) {
                            return;
                        }
                        // process a request
                        mysqlCon.query(request.query, function () {
                            request.callback();
                            requestsLeft--;
                            if (requestsLeft == 0) {
                                savedAllCallback();
                            }
                            else {
                                executeQueryRequestOnConnection(mysqlCon, poolRequests.shift());
                            }
                        });
                    }
                    executeQueryRequestOnConnection(mysqlCon, poolRequests.shift());
                });
            }
        }
    };
    Connection.prototype.killConnection = function () {
        this.connection.end();
    };
    return Connection;
})();
exports.Connection = Connection;
//# sourceMappingURL=sqlHelper.js.map
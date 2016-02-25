var mysql = require('mysql');
var poolRequests = [];
var settings = require('../connection.json');
var Connection = (function () {
    function Connection() {
    }
    Connection.prototype.format = function (query, inserts) {
        return mysql.format(query, inserts);
    };
    Connection.prototype.query = function (query, queryCallback) {
        this.connection.query(query, queryCallback);
    };
    Connection.prototype.createConnection = function () {
        this.connection = mysql.createConnection(settings);
        this.connection.connect();
    };
    Connection.prototype.addQueryToPool = function (query, callback) {
        poolRequests.push({ query: query, callback: callback });
    };
    Connection.prototype.executePool = function () {
        if (poolRequests && poolRequests.length && poolRequests.length <= 0)
            return;
        this.pool = mysql.createPool(settings);
        if (poolRequests.length < 100) {
            this.createConnection();
            while (poolRequests.length > 0) {
                var sqlItem = poolRequests.shift();
                this.query(sqlItem.query, sqlItem.callback);
            }
            this.killConnection();
        }
        else {
            var sqlPerConnection = Math.ceil(poolRequests.length / settings.connectionLimit);
            for (var c = 0; c < settings.connectionLimit; c++) {
                if (poolRequests.length <= 0)
                    break;
                this.pool.getConnection(function (err, connection) {
                    if (err) {
                        connection && connection.release();
                        console.log(err);
                        return;
                    }
                    console.log('connected as id ' + connection.threadId);
                    if (poolRequests.length <= 0)
                        return;
                    for (var i = 0; i < sqlPerConnection; i++) {
                        var queryItem = poolRequests.shift();
                        if (queryItem) {
                            connection.query(queryItem.query, queryItem.callback);
                        }
                    }
                    connection.release();
                });
            }
        }
    };
    Connection.prototype.killConnection = function () {
        this.connection.end();
    };
    return Connection;
})();
module.exports = Connection;
//# sourceMappingURL=sqlHelper.js.map
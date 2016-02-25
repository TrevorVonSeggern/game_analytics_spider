/**
 * Created by trevor on 1/13/16.
 */
declare function require(name:string);
declare var module;

var mysql = require('mysql');
var poolRequests = [];
var settings = require('../connection.json');

class Connection {
    connection: any;
    pool: any;

    format(query, inserts) {
        return mysql.format(query, inserts)
    }
    query(query, queryCallback) {
        this.connection.query(query, queryCallback);
    }
    createConnection () {
        this.connection = mysql.createConnection(settings);
        this.connection.connect();
    }
    addQueryToPool (query, callback) {
        poolRequests.push({query: query, callback: callback});
    }
    executePool () {
        if(poolRequests && poolRequests.length  && poolRequests.length <= 0)
            return; // don't bother if there aren't any queries

        this.pool = mysql.createPool(settings); // create pool.

        // only needs one connection because the data amount doesn't justify it.
        if(poolRequests.length < 100) {
            this.createConnection();
            while(poolRequests.length > 0) {
                var sqlItem = poolRequests.shift();
                this.query(sqlItem.query, sqlItem.callback);
            }
            this.killConnection();
        }
        else { // Big data

            //create multiple connections
            var sqlPerConnection = Math.ceil(poolRequests.length / settings.connectionLimit);

            for(var c = 0; c < settings.connectionLimit; c++) {
                if(poolRequests.length <= 0)
                    break;

                this.pool.getConnection(function(err, connection) {
                    if(err) {
                        connection && connection.release();
                        console.log(err);
                        return;
                    }
                    console.log('connected as id ' + connection.threadId);

                    if(poolRequests.length <= 0)
                        return;

                    for(var i = 0; i < sqlPerConnection; i++) {
                        var queryItem = poolRequests.shift();
                        if(queryItem) {
                            connection.query(queryItem.query, queryItem.callback);
                        }
                    }
                    connection.release();
                });
            }
        }
    }
    killConnection () {
        this.connection.end();
    }
}

module.exports = Connection;
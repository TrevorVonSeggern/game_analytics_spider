/**
 * Created by trevor on 1/13/16.
 */

var mysql = require('mysql');
var poolRequests:any[] = [];
var settings = require('../connection.json');

export class Connection {
    connection:any;
    pool:any;

    static format(query:string, inserts:string):string {
        return mysql.format(query, inserts)
    }

    query(query:string, queryCallback:(err:any, data:any[]) => any) {
        this.connection.query(query, queryCallback);
    }

    createConnection() {
        this.connection = mysql.createConnection(settings);
        this.connection.connect();
    }

    static addQueryToPool(query:any, callback:(param:any) => any) {
        poolRequests.push({query: query, callback: callback});
    }

    executePool(savedAllCallback:() => any) {
        if (poolRequests && poolRequests.length && poolRequests.length <= 0)
            return; // don't bother if there aren't any queries

        this.pool = mysql.createPool(settings); // create pool.

        var requestsLeft:number = poolRequests.length;
        // only needs one connection because the data amount doesn't justify it.
        if (poolRequests.length < 10) {
            this.createConnection();
            while (poolRequests.length > 0) {
                var sqlItem = poolRequests.shift();
                this.query(sqlItem.query, function() {
                    requestsLeft--;
                    sqlItem.callback();
                    if(requestsLeft == 0) {
                        savedAllCallback();
                    }
                });
            }
            this.killConnection();
        }
        else { // Big data
            for (var c = 0; c < settings.connectionLimit; c++) {
                this.pool.getConnection(function (error:any, mysqlCon:any) {
                    if (error) {
                        mysqlCon && mysqlCon.release();
                        console.log(error);
                        return;
                    }
                    function executeQueryRequestOnConnection(mysqlCon:any, request:any) {
                        // ran out of requests
                        if (request == undefined || request == null || request == {}) {
                            return;
                        }

                        // process a request
                        mysqlCon.query(request.query, function () {
                            request.callback();
                            requestsLeft--;
                            if(requestsLeft == 0) {
                                savedAllCallback();
                            } else {
                                executeQueryRequestOnConnection(mysqlCon, poolRequests.shift());
                            }
                        });
                    }

                    executeQueryRequestOnConnection(mysqlCon, poolRequests.shift());
                });
            }
        }
    }

    killConnection() {
        this.connection.end();
    }
}

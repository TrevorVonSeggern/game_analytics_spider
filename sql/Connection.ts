import {queryRequest} from "./queryRequest";
/**
 * Created by trevor on 1/13/16.
 */

var mysql = require('mysql');
var settings = require('../connection.json');

export class Connection {
    static pool:any = undefined;
    static poolActiveConnections:number = 0;
    requestPool: queryRequest[] = [];

    static format(query:string, inserts:string[]):string {
        return mysql.format(query, inserts)
    }

    query(query:string, queryCallback:(err:any, data:any[]) => any) {
        this.connection.query(query, queryCallback);
    }

    static executeQueryRequestOnConnection(mysqlCon:any, requestPool:queryRequest[], finishedCallback : () => any) {
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
            } else {
                Connection.executeQueryRequestOnConnection(mysqlCon, requestPool, finishedCallback);
            }
        });
    }

    executePool(savedAllCallback:() => any) {
        if (this.requestPool == undefined || this.requestPool.length == undefined || this.requestPool.length <= 0) {
            return; // don't bother if there aren't any queries
        }

        if(Connection.pool == undefined) {
            Connection.pool = mysql.createPool(settings); // create pool.
        }

        var connections_to_create:number = (settings.connectionLimit - Connection.poolActiveConnections);
        for (var c = 0; c < connections_to_create; c++) {
            Connection.pool.getConnection(function (error:any, mysqlCon:any) {
                if (error) {
                    mysqlCon && mysqlCon.release();
                    console.log(error);
                    return;
                }

                Connection.poolActiveConnections++;

                Connection.executeQueryRequestOnConnection(mysqlCon, this.requestPool, function() {
                    Connection.poolActiveConnections--;
                    mysqlCon.release();
                    savedAllCallback();
                });
            });
        }
    }
}

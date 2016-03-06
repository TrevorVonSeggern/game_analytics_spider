/**
 * Created by trevor on 1/24/16.
 */
import {Connection} from "../sql/sqlHelper";
import {Game} from "./game";
import {Cache} from "./cache";



export class Games {
    constructor() {
    }

    public static get sql(){
        return {
            getAllSql: 'SELECT * FROM gameAnalytics.game;',
            getOneSql: 'SELECT *  FROM gameAnalytics.game WHERE id = ? limit 1;'
        };
    }

    static formatGetOne(id:string) {
        return Connection.format(Games.sql.getOneSql, id);
    }

    static getAll(gameCallback:(game:Game) => void, doneCallback:() => void) {
        var con = new Connection();

        con.createConnection();
        con.query(Games.sql.getAllSql, function (err:any, data:any[]) {
            if(err) {
                console.log(err);
                return;
            }
            if(!data || data.length == 0) {
                console.log("no data, can't get all games.");
                return;
            }
            for (var i = 0; data && data.length && i < data.length; i++) {
                var game:Game = new Game(data[i]);
                // put everything into the cache
                Cache.storeObject(game);
                gameCallback(game);
            }
            doneCallback && doneCallback();
        });
        con.killConnection();
    }

    static getOneGameDatabase(id:string, oneCallback:(game:Game) => void):void {
        console.log(this.formatGetOne(id));
        var con = new Connection();
        con.createConnection();
        con.query(this.formatGetOne(id), function (err:string, data:any[]) {
            if (err) {
                console.log(err);
                return;
            }
            if(!data || data.length == 0) {
                console.log("no data for query - [" + this.formatGetOne(id) + "]");
                return;
            }

            var game = new Game(data[0]);
            //game exists in cache
            Cache.storeObject(game);
            oneCallback(game);
        });
        con.killConnection();
    }

    static getOne(id:string, oneCallback:(game:Game) => void):void {
        if (id == undefined)
            return undefined;
        Cache.getObject(id, function (cachedGame:Game) {
            if (!cachedGame) {
                Games.getOneGameDatabase(id, oneCallback);
            } else {
                oneCallback && oneCallback(cachedGame);
            }
        });
    }
}
/**
 * Created by trevor on 1/24/16.
 */
var sqlHelper_1 = require("../sql/sqlHelper");
var game_1 = require("./game");
var cache_1 = require("./cache");
var Games = (function () {
    function Games() {
    }
    Object.defineProperty(Games, "sql", {
        get: function () {
            return {
                getAllSql: 'SELECT * FROM gameAnalytics.game;',
                getOneSql: 'SELECT *  FROM gameAnalytics.game WHERE id = ? limit 1;'
            };
        },
        enumerable: true,
        configurable: true
    });
    Games.formatGetOne = function (id) {
        return sqlHelper_1.Connection.format(Games.sql.getOneSql, id);
    };
    Games.getAll = function (gameCallback, doneCallback) {
        var con = new sqlHelper_1.Connection();
        con.createConnection();
        con.query(Games.sql.getAllSql, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            if (!data || data.length == 0) {
                console.log("no data, can't get all games.");
                return;
            }
            for (var i = 0; data && data.length && i < data.length; i++) {
                var game = new game_1.Game(data[i]);
                // put everything into the cache
                cache_1.Cache.storeObject(game);
                gameCallback(game);
            }
            doneCallback && doneCallback();
        });
        con.killConnection();
    };
    Games.getOneGameDatabase = function (id, oneCallback) {
        console.log(this.formatGetOne(id));
        var con = new sqlHelper_1.Connection();
        con.createConnection();
        con.query(this.formatGetOne(id), function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            if (!data || data.length == 0) {
                console.log("no data for query - [" + this.formatGetOne(id) + "]");
                return;
            }
            var game = new game_1.Game(data[0]);
            //game exists in cache
            cache_1.Cache.storeObject(game);
            oneCallback(game);
        });
        con.killConnection();
    };
    Games.getOne = function (id, oneCallback) {
        if (id == undefined)
            return undefined;
        cache_1.Cache.getObject(id, function (cachedGame) {
            if (!cachedGame) {
                Games.getOneGameDatabase(id, oneCallback);
            }
            else {
                oneCallback && oneCallback(cachedGame);
            }
        });
    };
    return Games;
})();
exports.Games = Games;
//# sourceMappingURL=games.js.map
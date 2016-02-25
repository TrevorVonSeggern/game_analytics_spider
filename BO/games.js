var sqlHelper = require('../sql/sqlHelper.js');
var linq = require('linq');
var sql = {
    getAll: 'SELECT * FROM gameAnalytics.game;',
    getOne: 'SELECT *  FROM gameAnalytics.event WHERE id = ? limit 10;'
};
var gameCache = [];
var Games = (function () {
    function Games() {
    }
    Games.getOneGameCache = function (id) {
        var result;
        linq.from(gameCache).where(function (i) {
            return i.id == id;
        }).forEach(function (obj) {
            result = obj;
        });
        return result;
    };
    Games.formatGetOne = function (inserts) {
        var helper = new sqlHelper();
        return helper.format(sql.getOne, inserts);
    };
    Games.getAll = function (gameCallback) {
        var con = new sqlHelper();
        con.createConnection();
        con.query(sql.getAll, function (err, data, info) {
            for (var i = 0; i < data.length; i++) {
                var req = require('./game.js');
                var game = new req(data[i]);
                var cache = Games.getOneGameCache(game.id);
                if (!cache) {
                    gameCache.push(game);
                }
                gameCallback(game);
            }
        });
        con.killConnection();
    };
    Games.getOneGameDatabase = function (id, oneCallback) {
        var con = new sqlHelper();
        con.createConnection();
        con.query(sql.getAll, function (err, data, info) {
            for (var i = 0; i < data.length; i++) {
                var game = new (require('./game.js'))(data[i]);
                var cache = Games.getOneGameCache(game.id);
                if (!cache) {
                    gameCache.push(game);
                }
                oneCallback(data);
            }
        });
        con.killConnection();
    };
    Games.prototype.getOne = function (id, oneCallback) {
        var game = Games.getOneGameCache(id);
        if (game) {
            if (oneCallback) {
                oneCallback(game);
            }
            else {
                return game;
            }
        }
        else {
            Games.getOneGameDatabase(id, oneCallback);
        }
    };
    return Games;
})();
exports.Games = Games;
//# sourceMappingURL=games.js.map
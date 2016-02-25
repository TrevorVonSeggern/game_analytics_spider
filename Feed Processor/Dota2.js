var gameCollectionLib = require('../BO/games');
var eventCollectionLib = require('../BO/events');
var sqlHelper = require('../sql/sqlHelper');
var eventLib = require('../BO/event');
var Dota2 = (function () {
    function Dota2() {
    }
    Dota2.prototype.getAndProcessEvents = function () {
        console.log('Getting all games');
        gameCollectionLib.Games.getAll(function (game) {
            console.log('Getting all events for ' + game.name);
            Dota2.getNewEvents(game, function (event) {
                Dota2.processEvent(event);
            });
        });
    };
    Dota2.prototype.truncateEvents = function (callback) {
        var connection = new sqlHelper();
        connection.createConnection();
        connection.query('TRUNCATE TABLE gameAnalytics.event;', callback);
        connection.killConnection();
    };
    Dota2.getNewEvents = function (game, callback) {
        if (game.name === "dota 2") {
            var request = require('request');
            request({ uri: 'http://www.datdota.com/ticket.php' }, function (err, response, body) {
                if (err) {
                    return;
                }
                var cheerio = require('cheerio');
                var parser = cheerio.load(body);
                var connection = new sqlHelper();
                parser('tbody tr').each(function () {
                    var firstTag = parser('td a')[0];
                    var secondTag = parser('td a')[1];
                    var thirdTag = parser('td')[2];
                    var fourthTag = parser('td')[3];
                    var ev = new eventLib.EventClass();
                    ev.url = firstTag.attribs.href;
                    ev.name = firstTag.children[0].data;
                    ev.startDate = new Date(thirdTag.children[0].data);
                    if (fourthTag.children[0].data)
                        ev.endDate = fourthTag.children[0].data;
                    else
                        ev.endDate = ev.startDate;
                    ev.gameID = game.id;
                    ev.save(connection, function (error) {
                        if (error) {
                            console.log('error here');
                            return;
                        }
                        callback(ev);
                    });
                });
                connection.executePool();
            });
        }
    };
    Dota2.processEvent = function (event) {
        var game = event.getGame();
        console.log('Processing event: ' + event.name + ' in game "' + game.name + '"');
    };
    return Dota2;
})();
exports.Dota2 = Dota2;
module.exports = Dota2;
//# sourceMappingURL=Dota2.js.map
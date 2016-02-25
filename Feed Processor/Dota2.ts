/**
 * Created by trevor on 1/28/16.
 */
declare var Date:DateConstructor;

var gameCollectionLib = require('../BO/games');
var eventCollectionLib = require('../BO/events');
var sqlHelper = require('../sql/sqlHelper');
var eventLib = require('../BO/event');

export class Dota2 {
    getAndProcessEvents() {
        console.log('Getting all games');

        // get the types of games... i.e. dota 2...
        gameCollectionLib.Games.getAll(function (game) {

            console.log('Getting all events for ' + game.name);

            Dota2.getNewEvents(game, function (event) {
                //truncateEvents(processEvent);
                Dota2.processEvent(event);
            });
        });
    }
    truncateEvents(callback) {
        var connection = new sqlHelper();
        connection.createConnection();
        connection.query('TRUNCATE TABLE gameAnalytics.event;', callback);
        connection.killConnection();
    }
    static getNewEvents(game, callback) {
        if (game.name === "dota 2") {
            // This code needs to be moved
            var request = require('request');

            request({uri: 'http://www.datdota.com/ticket.php'}, function (err, response, body) {
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
                    if(fourthTag.children[0].data) ev.endDate = fourthTag.children[0].data;
                    else ev.endDate = ev.startDate;
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
    }
    static processEvent(event) {
        var game = event.getGame();
        console.log('Processing event: ' + event.name + ' in game "' + game.name + '"');


    }
}

module.exports = Dota2;
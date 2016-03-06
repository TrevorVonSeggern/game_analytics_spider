var sqlHelper_1 = require("../sql/sqlHelper");
var tournament_1 = require("../BO/tournament");
var games_1 = require("../BO/games");
var team_1 = require("../BO/team");
var request = require('request');
var Promise = require('promise');
var hash = require('hashtable');
var Dota2 = (function () {
    function Dota2() {
    }
    Dota2.prototype.getAndProcess = function (done) {
        console.log('Getting all games');
        var vm = this;
        var eventsToWaitOn = 3; // one for getting all the events, one for saving all the events
        var promise = new Promise(function (resolve) {
            // get the types of games... i.e. dota 2...
            games_1.Games.getAll(function (game) {
                console.log('Getting all events for ' + game.name);
                vm.getNewEvents(game, function (event) {
                    vm.processEvent(event);
                }, function () {
                    eventsToWaitOn--;
                    if (eventsToWaitOn == 0) {
                        resolve();
                    }
                    console.log("Saved all games for - " + game.name);
                });
            }, function () {
                eventsToWaitOn--;
                if (eventsToWaitOn == 0) {
                    resolve();
                }
                console.log("finished getting all games.");
            });
        });
        promise.then(done);
    };
    Dota2.prototype.truncateEvents = function (callback) {
        var connection = new sqlHelper_1.Connection();
        connection.createConnection();
        connection.query('TRUNCATE TABLE gameAnalytics.event;', callback);
        connection.killConnection();
    };
    Dota2.prototype.getNewEvents = function (game, callback, savedAllCallback) {
        if (game.name !== "dota 2") {
            return;
        }
        var tournaments = [];
        request({ uri: 'http://www.datdota.com/ticket.php' }, function (err, response, body) {
            if (err) {
                return;
            }
            console.log("downloaded from the website.");
            var cheerio = require('cheerio');
            var parsedHTML = cheerio.load(body);
            var connection = new sqlHelper_1.Connection();
            var tournaments = [];
            parsedHTML('tbody tr').map(function (i, item) {
                var tournament = new tournament_1.Tournament();
                tournament.gameID = game.id;
                tournaments.push(tournament);
            });
            // get name
            parsedHTML('tbody tr td a[href^="ticket_league"]').map(function (i, item) {
                tournaments[i].name = item.children[0].data;
                tournaments[i].url = "http://www.datdota.com/ticket_league.php?q=" + item.attribs.href.match(/php\?q=(\d+)&/)[1];
            });
            //start date
            parsedHTML('tbody tr td:nth-child(3)').map(function (i, item) {
                if (item.children.length != 0) {
                    tournaments[i].startDate = new Date(item.children[0].data);
                }
                else {
                    tournaments[i].startDate = new Date();
                }
            });
            //end date
            parsedHTML('tbody tr td:nth-child(4)').map(function (i, item) {
                if (item.children.length != 0) {
                    tournaments[i].endDate = new Date(item.children[0].data);
                }
                else {
                    tournaments[i].startDate = new Date();
                }
                if (tournaments[i].startDate > tournaments[i].endDate) {
                    tournaments[i].endDate = tournaments[i].startDate;
                }
            });
            console.log("going to save tournaments");
            for (var i = 0; i < tournaments.length; i++) {
                callback(tournaments[i]);
                tournaments[i].save(connection, function (error) {
                    if (error) {
                        console.log('error here');
                        return;
                    }
                });
            }
            connection.executePool(function () {
                savedAllCallback(tournaments);
            });
            console.log("finished parsing tournaments");
        });
    };
    Dota2.prototype.getNewTeams = function () {
        var tmList = this.teamList;
        var teams = [];
        request({ uri: "http://www.datdota.com/directory.php?q=Team" }, function (err, response, body) {
            if (err) {
                console.log(err);
                return;
            }
            var cheerio = require('cheerio');
            var parsedHTML = cheerio.load(body);
            parsedHTML('tbody tr td:nth-child(1)').map(function (i, item) {
                var team = new team_1.Team();
                team.name = item.children[0].data;
                teams.push(team);
            });
            parsedHTML('tbody tr td:nth-child(1) a').map(function (i, item) {
                teams[i].alternateName = item.children[0].data;
                teams[i].url = item.attribs.href;
            });
            parsedHTML('tbody tr td:nth-child(3)').map(function (i, item) {
                teams[i].active = item.children[0].data == "Active";
                tmList.add(teams[i]);
            });
            //team.url = "http://www.datdota.com/" + item.attribs.href;
        });
    };
    Dota2.prototype.processEvent = function (tournament) {
        return;
        // Need to populate teams first.
        /*
        request({uri: tournament.url}, function (err:any, response:any, body:any) {
            if(err) {
                console.log(err);
                return;
            }

            var matchList:Match[] = [];

            var cheerio = require('cheerio');
            var parsedHTML = cheerio.load(body);
            parsedHTML('tbody tr td:first-child a').map(function (i:number, item:any) {
                var match:Match = new Match();
                match.externalID = Number(item.children[0].data);
                match.url = "http://www.datdota.com/" + item.attribs.href;
                matchList.push(match);
            });
            parsedHTML('tbody tr td:nth-child(2)').map(function (i:number, item:any) {
                matchList[i].startDate = item.children[0].data;
            });
            parsedHTML('tbody tr td:nth-child(3)').map(function (i:number, item:any) {
                matchList[i].startDate = item.children[0].data;
            });
        });
        */
    };
    return Dota2;
})();
exports.Dota2 = Dota2;
//# sourceMappingURL=Dota2.js.map
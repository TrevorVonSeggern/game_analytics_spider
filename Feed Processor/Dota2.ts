import {Game} from "../BO/game";
import {Connection} from "../sql/sqlHelper";
import {Tournament} from "../BO/tournament";
import {Games} from "../BO/games";
import {IFeedProcessorInterface} from "../Feed Processor/processorInterface";
import {Match} from "../BO/match";
import {Teams} from "../BO/teams";
import {Team} from "../BO/team";

declare var Date:DateConstructor;
var request = require('request');
var Promise = require('promise');
var hash = require('hashtable');

export class Dota2 implements IFeedProcessorInterface{
    getAndProcess(done: () => void) {
        console.log('Getting all games');
        var vm:Dota2 = this;
        var eventsToWaitOn = 3;// one for getting all the events, one for saving all the events
        var promise:any = new Promise(function (resolve:() => any){
            // get the types of games... i.e. dota 2...
            Games.getAll(function (game:Game) {

                console.log('Getting all events for ' + game.name);

                vm.getNewEvents(game, function (event:Tournament) {
                    vm.processEvent(event);
                }, function() {
                    eventsToWaitOn--;
                    if(eventsToWaitOn == 0) {
                        resolve();
                    }
                    console.log("Saved all games for - " + game.name);
                });

            }, function() {
                eventsToWaitOn--;
                if(eventsToWaitOn == 0)  {
                    resolve();
                }
                console.log("finished getting all games.")
            });
        });
        promise.then(done);
    }

    truncateEvents(callback:() => any): void {
        var connection = new Connection();
        connection.createConnection();
        connection.query('TRUNCATE TABLE gameAnalytics.event;', callback);
        connection.killConnection();
    }

    getNewEvents(game:Game, callback:(event:Tournament) => any, savedAllCallback:(tournaments:Tournament[]) => any) {
        if (game.name !== "dota 2") {
            return;
        }
        var tournaments:Tournament[] = [];

        request({uri: 'http://www.datdota.com/ticket.php'}, function (err:any, response:any, body:any) {
            if (err) {
                return;
            }
            console.log("downloaded from the website.");

            var cheerio = require('cheerio');
            var parsedHTML = cheerio.load(body);

            var connection = new Connection();
            var tournaments:Tournament[] = [];
            parsedHTML('tbody tr').map(function (i:number, item:any) {
                var tournament:Tournament = new Tournament();
                tournament.gameID = game.id;
                tournaments.push(tournament);
            });
            // get name
            parsedHTML('tbody tr td a[href^="ticket_league"]').map(function (i:number, item:any) {
                tournaments[i].name = item.children[0].data;
                tournaments[i].url = "http://www.datdota.com/ticket_league.php?q=" + item.attribs.href.match(/php\?q=(\d+)&/)[1];
            });
            //start date
            parsedHTML('tbody tr td:nth-child(3)').map(function (i:number, item:any) {
                if (item.children.length != 0) {
                    tournaments[i].startDate = new Date(item.children[0].data);
                } else {
                    tournaments[i].startDate = new Date();
                }
            });
            //end date
            parsedHTML('tbody tr td:nth-child(4)').map(function (i:number, item:any) {
                if (item.children.length != 0) {
                    tournaments[i].endDate = new Date(item.children[0].data);
                } else {
                    tournaments[i].startDate = new Date();
                }

                if(tournaments[i].startDate > tournaments[i].endDate) {
                    tournaments[i].endDate = tournaments[i].startDate;
                }
            });

            console.log("going to save tournaments");
            for(var i = 0; i < tournaments.length; i++) {
                callback(tournaments[i]);
                tournaments[i].save(connection, function (error:string) {
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
    }

    teamList:Teams;
    getNewTeams() {
        var tmList = this.teamList;
        var teams:Team[] = [];

        request({uri: "http://www.datdota.com/directory.php?q=Team"}, function (err:any, response:any, body:any) {
            if (err) {
                console.log(err);
                return;
            }

            var cheerio = require('cheerio');
            var parsedHTML = cheerio.load(body);
            parsedHTML('tbody tr td:nth-child(1)').map(function (i:number, item:any) {
                var team:Team = new Team();
                team.name = item.children[0].data;
                teams.push(team);
            });
            parsedHTML('tbody tr td:nth-child(1) a').map(function (i:number, item:any) {
                teams[i].alternateName = item.children[0].data;
                teams[i].url = item.attribs.href;
            });
            parsedHTML('tbody tr td:nth-child(3)').map(function (i:number, item:any) {
                teams[i].active = item.children[0].data == "Active";
                tmList.add(teams[i]);
            });
            //team.url = "http://www.datdota.com/" + item.attribs.href;
        });
    }

    processEvent(tournament:Tournament):void {
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
    }
}

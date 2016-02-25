// Created by Trevor Von Seggern at Jan 13 2016 7:09PM
var util = require('util');
exports._K_VALUE = 50;
var teamList;
var roundList;

function Init() {
    console.log('Getting Teams');

    //get all the teams...

    //get all roundList...
}

function factorial(n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

function correctBinomial(expectedOutcome, m, n) {
    var result = 0;
    for (var i = m; i <= n; i++) {
        var a = factorial(n) / (factorial(i) * factorial(n - i));
        result += a * Math.pow(expectedOutcome, i) * Math.pow(1 - expectedOutcome, n - i);
    }
    return result;
}

function calculateCorrectness() {
    console.log("Calculating Correctness");
    var expectedOutcome = 0;
    var actualOutcome = 0;
    var correctPrediction = 0;
    for (var i = 0; i < roundList.length; i++) {
        var odds = EloFormula(round.ELO1, round.ELO2);
        expectedOutcome += odds;
        actualOutcome += round.Winner ? 1 : 0;
        correctPrediction += ((odds >= 0.5 && round.Winner) || (odds < 0.5 && !round.Winner)) ? 1 : 0;
    }
    console.log("Predicted Correctly: " + correctPrediction + " Out of: " + roundList.length + " roundList");
    console.log("Percent Correct... " + correctPrediction / roundList.length);
    console.log(util.format("Expected Result: %d, Actual Result: %d, K-Value: %d", expectedOutcome, actualOutcome, _K_VALUE));
}

function calculateExpectedOutcomeOneRound(round) {
    var team1 = round.RNDTeam1Team;
    var team2 = round.RNDTeam2Team;

    var diff = team2.ELOValue - team1.ELOValue;

    return EloFormula(team1.ELOValue, team2.ELOValue);
}

function eloFormula(elo1, elo2) {
    return 1 / (1 + Math.Pow(10, ((elo2 - elo1) / 400)));
}

function calculateExpectedOutcome(teamA, teamB, matches) {
    var team1 = new BOTeam(teamA);
    var team2 = new BOTeam(teamB);

    var diff = team2.ELOValue - team1.ELOValue;

    var expectedOutcome = 1 / (1 + Math.Pow(10, diff / 400));

    var matchesToWin = Math.ceil(matches / 2);

    return correctBinomial(expectedOutcome, matchesToWin, matches);
}

function addMatch(teamA, teamB, winner) {
    var result = winner ? 1 : 0;

    var expectedOutcomeA = CalculateExpectedOutcome(teamA, teamB, 1);
    var expectedOutcomeB = CalculateExpectedOutcome(teamB, teamA, 1);

    var team1 = new BOTeam(teamA);
    var team2 = new BOTeam(teamB);

    team1.ELOValue = Math.round(team1.ELOValue + exports._K_VALUE * (result - expectedOutcomeA));
    team2.ELOValue = Math.round(team2.ELOValue + exports_K_VALUE * ((1 - result) - expectedOutcomeB));

    team1.save();
    team2.save();
}

function addRound(round) {
    var result = round.Winner ? 1 : 0;

    var expectedOutcomeA = calculateExpectedOutcomeFast(round);
    var expectedOutcomeB = 1 - expectedOutcomeA;

    var team1 = round.RNDTeam1Team;
    var team2 = round.RNDTeam2Team;

    team1.ELOValue = Math.round(team1.ELOValue + exports._K_VALUE * (result - expectedOutcomeA));
    team2.ELOValue = Math.round(team2.ELOValue + exports._K_VALUE * ((1 - result) - expectedOutcomeB));
}

function recalculateRankings() {
    console.log("Reset team elo values");

    for (var pair in teamList) {
        var team = pair.team;
        team.ELOValue = 1200;
        team.save();
        console.log("Team " + team.name);
    }

    console.log("Getting and ordering all roundList by date");
    for(round in roundList)
    {
        console.log(util.format("elo cd{5} ID:{0},_EV{4},_S/D:{1}_E/D{2}_ExtID:{3}"
            , round.ID
            , round.match.event.startDate.ToShortDateString()
            , round.match.event.endDate.ToShortDateString()
            , round.externalID
            , round.match.event.ID));

        addRound(round);

        round.ELO1 = round.RNDTeam1Team.ELOValue;
        round.ELO2 = round.RNDTeam2Team.ELOValue;
        round.save();

        round.save();
    }
}

function recalculateRankingsFast() {
    console.log("Reseting All Teams");
    var tcoll = BOTeam.GetAll();
    teamdict = [];
    for(team in tcoll) {
        team.ELOValue = 1200;
        team.save();
        teamdict.push({'id': team.ID, 'team':team});
    }
    ProcessEloRoundList();
}

function updateRankingsFast() {
    console.log("Updating rankings");
    var tcoll = BOTeam.GetAll();
    teamdict = [];
    for(var team in tcoll) {
        teamdict.push({'id':team.ID, 'team': team});
    }
    var rounds = BORound.getAllRoundsOrderedByDate();

    // TODO: lambda syntax...
    var roundsToUpdate; // = rounds.FindAll(r => r.ELO1 == 0 && r.ELO2 == 0);

    if (roundsToUpdate.length == 0) {
        console.log("No roundList to update.");
    } else {
        console.log("Updating " + roundsToUpdate.length + " rounds.");
        processEloRoundList();
    }
}

function processEloRoundList () {
    var countDown = roundList.length;

    console.log("Processing All Rounds");
    for (var round in roundList)
    {
        var result = round.winner ? 1 : 0;

        var expectedOutcomeA = calculateExpectedOutcomeFast(round);
        var expectedOutcomeB = 1 - expectedOutcomeA;

        var team1 = teamList[round.RNDTeam1Team.ID];
        var team2 = teamList[round.RNDTeam2Team.ID];

        round.ELO1 = team1.ELOValue;
        round.ELO2 = team2.ELOValue;

        team1.ELOValue = Math.round(team1.ELOValue + exports._K_VALUE * (result - expectedOutcomeA));
        team2.ELOValue = Math.round(team2.ELOValue + exports._K_VALUE * ((1 - result) - expectedOutcomeB));

        round.save();
    }

    console.log("Saving teams");
    for (var item in teamList)
    {
        item.team.save();
    }
    return true;
}

function calculateExpectedOutcomeFast(round) {
    return calculateExpectedOutcomeFast(round.RNDTeam1Team, round.RNDTeam1Team, round.match.rounds.length);
}

function calculateExpectedOutcomeFast(match) {
    return calculateExpectedOutcomeFast(match.getRounds()[0].RNDTeam1Team, match.getRounds()[1].RNDTeam1Team, match.rounds.length);
}

function calculateExpectedOutcomeFast(teamA, teamB, matches) {
    var diff = teamB.ELOValue - teamA.ELOValue;

    var expectedOutcome = 1 / (1 + Math.Pow(10, diff / 400));

    var matchesToWin = Math.ceil(matches / 2);

    return correctBinomial(expectedOutcome, matchesToWin, matches);
}

function getTeamByID(teams, id) {
    // TODO: Lambda Expression
    //return teams.Where(m => m.ID == id).ToList<BOTeam>()[0];
    return teamList[id];
}

function getTeamIndexByID(teams, id) {
    // TODO: lambda
    //return teams.IndexOf(teams.Where(m => m.ID == id).ToList<BOTeam>()[0]);
}

function getPercentCorrect() {
    var predictedCorrect = 0;

    var matches = BOMatch.GetAllMatchesOrderedByDate();
    //for (var round in matches) {
    //  if(CalculateExpectedOutcomeFast(round))
    //}

    return 0;
}

function calculateBet(team1, team2, maxAmount, odds, matches, amountToBet) {
    var expectedOutcome = calculateExpectedOutcome(team1, team2, matches);
    console.log(expectedOutcome);
    var ev1 = (1 - odds) * expectedOutcome;
    var ev2 = odds * (1 - expectedOutcome);
    console.log(ev1);
    console.log(ev2);

    if (ev1 >= ev2) {
        amountToBet = expectedOutcome * maxAmount;
    } else {
        amountToBet = (1 - expectedOutcome) * maxAmount;
    }
    return amountToBet;
}
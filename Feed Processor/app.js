/**
 * Created by trevor on 1/13/16.
 */

var operation = 0;

if(operation === 0) {
    var feedProcessor = new (require('./Dota2.js'))();
    feedProcessor.getAndProcessEvents();
} else if(operation === 1) {
    console.log('ELO Canculation Section.');
} else if(operation === 2) {
    var elo = require('./../Elo Processor/Elo.js');
    var amountToBet = elo.CalculateBet(41, 44, (3.06 + 2.19 + 2.07 + 1.9), .76, 3);
    console.log(amountToBet);
}
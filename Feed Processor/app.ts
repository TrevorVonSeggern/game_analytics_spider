import {Dota2} from "./Dota2";
/**
 * Created by trevor on 1/13/16.
 */
export class Feeder {
    operation:number = 0;

    Run() {
        console.log("Started feeding");

        if(this.operation === 0) {
            var feedProcessor = new Dota2();
            feedProcessor.getAndProcess(function(){
                console.log("finished everything");
                process.exit(0);
            });
        } else if(this.operation === 1) {
            console.log('ELO Calculation Section.');
        } else if(this.operation === 2) {
            var elo = require('./../Elo Processor/Elo');
            var amountToBet = elo.CalculateBet(41, 44, (3.06 + 2.19 + 2.07 + 1.9), .76, 3);
            console.log(amountToBet);
        }
    }
}

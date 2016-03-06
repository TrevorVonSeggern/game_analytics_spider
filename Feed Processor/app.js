var Dota2_1 = require("./Dota2");
/**
 * Created by trevor on 1/13/16.
 */
var Feeder = (function () {
    function Feeder() {
        this.operation = 0;
    }
    Feeder.prototype.Run = function () {
        console.log("Started feeding");
        if (this.operation === 0) {
            var feedProcessor = new Dota2_1.Dota2();
            feedProcessor.getAndProcess(function () {
                console.log("finished everything");
                process.exit(0);
            });
        }
        else if (this.operation === 1) {
            console.log('ELO Calculation Section.');
        }
        else if (this.operation === 2) {
            var elo = require('./../Elo Processor/Elo');
            var amountToBet = elo.CalculateBet(41, 44, (3.06 + 2.19 + 2.07 + 1.9), .76, 3);
            console.log(amountToBet);
        }
    };
    return Feeder;
})();
exports.Feeder = Feeder;
//# sourceMappingURL=app.js.map
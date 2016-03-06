import {Team} from "./team";
/**
* Created by trevor on 1/13/16.
*/
var hash = require("hashtable");

interface ITeams {
}

export class Teams implements ITeams{

    constructor() {
        this.waitingTable.reserve(500);
    }

    teamTable:any = new hash();

    log(){
        this.teamTable.forEach(function(c:number, key:string, value:Team) {
           value.log();
        });
    }

    waitingTable:any = new hash();

    waitOnTeam(externalID:number, callback: (team:Team) => void) {
        if(this.waitingTable.has(externalID)) {
            callback(this.waitingTable.get(externalID));
            this.waitingTable.remove(externalID);
        } else {
            this.waitingTable.add(externalID, callback);
        }

    }

    add(team:Team):void {
        if(this.waitingTable.has(team.externalID)) {
            this.waitingTable.get(team.externalID)(team);
            this.waitingTable.remove(team.externalID);
        }
        this.teamTable.put(team.alternateName, team);
    }

    reserve(size:Number):void {
        this.teamTable.reserve(size);
    }
}

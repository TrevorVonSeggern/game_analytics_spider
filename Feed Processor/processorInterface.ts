import {Game} from "../BO/game";
import {Tournament} from "../BO/tournament";
import {Teams} from "../BO/teams";

export interface IFeedProcessorInterface {
    teamList:Teams;
    getAndProcess: (done: () => void) => any;
    truncateEvents:(callback:() => void) => void;
    getNewEvents: (game:Game, callback:(event:Tournament) => void, savedAllCallback:(tournaments:Tournament[]) => void) => void;
}

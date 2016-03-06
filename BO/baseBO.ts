/**
 * Created by trevor on 3/3/16.
 */
import {Connection} from "../sql/sqlHelper";

export interface IbaseBO {
    id:string;
    log: () => void;
    save: (connection:Connection, callback:(object:any) => any) => void;
}

export class baseBO implements IbaseBO {
    id:string;

    constructor() {
        this.id = '';
    }

    log() {
        console.log("base object - id: " + this.id);
    }

    save(connection:Connection, callback:(object:any) => any) {
    }
}
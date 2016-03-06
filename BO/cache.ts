/**
 * Created by trevor on 1/14/16.
 * This is basically going to take the responsibility of not making more calls to the database than necessary.
 */
export class Cache {
    constructor() {

    }
    static objects:any = {};

    static getObject(id:string, callback:(param:any) => any) {
        var obj:any;
        obj = this.objects[id];
        callback && callback(obj);
        return obj;
    }

    // has to have an id field.
    static storeObject(obj:any) {
        if (obj && obj.id) {
            this.objects[obj.id] = obj;
        }
    }
}


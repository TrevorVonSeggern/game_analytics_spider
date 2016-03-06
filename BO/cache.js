/**
 * Created by trevor on 1/14/16.
 * This is basically going to take the responsibility of not making more calls to the database than necessary.
 */
var Cache = (function () {
    function Cache() {
    }
    Cache.getObject = function (id, callback) {
        var obj;
        obj = this.objects[id];
        callback && callback(obj);
        return obj;
    };
    // has to have an id field.
    Cache.storeObject = function (obj) {
        if (obj && obj.id) {
            this.objects[obj.id] = obj;
        }
    };
    Cache.objects = {};
    return Cache;
})();
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map
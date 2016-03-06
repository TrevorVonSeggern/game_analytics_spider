var baseBO = (function () {
    function baseBO() {
        this.id = '';
    }
    baseBO.prototype.log = function () {
        console.log("base object - id: " + this.id);
    };
    baseBO.prototype.save = function (connection, callback) {
    };
    return baseBO;
})();
exports.baseBO = baseBO;
//# sourceMappingURL=baseBO.js.map
var Satisfic = require('./index.js');

var Specification = function (spec) {
    this._spec = spec;
    this._orders = [];
    this._ignores = [];
};


var _invoke = function (spec, field, data, process) {
    var value = (data[field] === undefined) ? null : data[field];
    var checker = Satisfic.check(value);

    var func = spec._spec[field];
    var result = func.call(spec, checker, data, process);

    if (result === undefined) {
        process[field] = checker.str;
    } else {
        process[field] = result;
    }
};


Specification.prototype.isSatisfied = function (data, callback) {
    var errors = {};
    var results = {};
    var self = this;

    this._orders.forEach(function (field) {
        if (self._ignores.indexOf(field) >= 0) return;

        try {
            if (self._spec[field] === undefined) {
                throw new Error('Undefined ordered field [' + field + ']');
            }

            _invoke(self, field, data, results);
        } catch (e) {
            errors[field] = e;
        }
    });

    Object.keys(this._spec).forEach(function (field) {
        if (self._ignores.indexOf(field) >= 0) return;
        if (self._orders.indexOf(field) >= 0) return;

        try {
            _invoke(self, field, data, results);
        } catch (e) {
            errors[field] = e;
        }
    });



    if (Object.keys(errors).length) {
        if (typeof callback === 'function') {
            callback(errors);
        } else {
            return errors;
        }
    } else {
        if (typeof callback === 'function') {
            callback(null, results);
        } else {
            return results;
        }
    }
};

Specification.prototype.ignores = function (ignores) {
    this._ignores = ignores;
};

Specification.prototype.orders = function (orders) {
    this._orders = orders;
};


module.exports = exports = Specification;

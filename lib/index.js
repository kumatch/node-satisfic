var check = require('validator').check;

exports.check = function (value) {
    return check(value);
};

exports.spec = function (spec) {
    var Specification = require('./specification');
    return new Specification(spec);
};

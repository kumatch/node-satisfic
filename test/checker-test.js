var vows = require('vows'),
    assert = require('assert');

var Satisfic = require('../lib');

vows.describe('Satisfic').addBatch({
    'variables check started': {
        topic: function () {
            this.callback(null, Satisfic.check('foo'));
        },
        'should be created checker instance': function (err, checker) {
            assert.isNull(err);
            assert.isObject(checker);
        },
        'should be node-validate checker': function (err, checker) {
            assert.equal(checker.str, 'foo');
        }
    },

    'specification started': {
        topic: function () {
            this.callback(null, Satisfic.spec({
                name: function (c) { }
            }));
        },
        'should be created specification instance': function (err, spec) {
            assert.isNull(err);
            assert.isObject(spec);
            assert.isFunction(spec.isSatisfied);
        }
    }
}).export(module);

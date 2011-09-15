var vows = require('vows'),
    assert = require('assert');

var Specification = require('../lib/specification');

vows.describe('Specification').addBatch({
    'a notEmpty filed specification': {
        topic: function () {
            var spec = new Specification({
                name: function (c, data, progress) {
                    c.notEmpty();
                }
            });

            this.callback(null, spec);
        },
        'check blank object': {
            topic: function (spec) {
                var self = this;
                spec.isSatisfied({}, function (err) {
                    self.callback(null, err);
                });
            },
            'should be raised for notEmpty field': function (err, raise_errors) {
                assert.isNull(err);
                assert.isObject(raise_errors.name);
            }
        },
        'check valid object': {
            topic: function (spec) {
                spec.isSatisfied({name: 'foo'}, this.callback);
            },
            'should not be raised error': function (err, results) {
                assert.isNull(err);
            },
            'should be get result object': function (err, results) {
                assert.equal(results.name, 'foo');
            }
        }
    },

    'two notEmpty fields, custom checker specification': {
        topic: function () {
            var spec = new Specification({
                foo: function (c, data, progress) {
                    if (typeof data.getFoo === 'function') {
                        c.str = data.getFoo();
                    }

                    c.notEmpty();
                },
                bar: function (c, data, progress) {
                    c.notEmpty();
                    return c.str.toUpperCase();
                }
            });

            this.callback(null, spec);
        },
        'check blank object': {
            topic: function (spec) {
                var self = this;
                spec.isSatisfied({}, function (err) {
                    self.callback(null, err);
                });
            },
            'should be raised for two fields': function (err, raise_errors) {
                assert.isNull(err);
                assert.isObject(raise_errors.foo);
                assert.isObject(raise_errors.bar);
            }
        },
        'check valid object with getter method': {
            topic: function (spec) {
                spec.isSatisfied({
                    getFoo: function () {
                        return 'foo';
                    },
                    bar: 'bar'
                }, this.callback);
            },
            'should not be raised error': function (err, results) {
                assert.isNull(err);
            },
            'should be get result object': function (err, results) {
                assert.equal(results.foo, 'foo');
                assert.equal(results.bar, 'BAR');
            }
        }
    },

    'two notEmpty, toggle checking field specification': {
        topic: function () {
            var spec = new Specification({
                foo: function (c, data, progress) {
                    c.notEmpty();
                },
                bar: function (c, data, progress) {
                    if (progress.foo !== undefined) {
                        c.notEmpty();
                    }
                }
            });

            this.callback(null, spec);
        },
        'check blank object': {
            topic: function (spec) {
                var self = this;
                spec.isSatisfied({}, function (err) {
                    self.callback(null, err);
                });
            },
            'should be raised for a first field': function (err, raise_errors) {
                assert.isNull(err);
                assert.isObject(raise_errors.foo);
                assert.isUndefined(raise_errors.bar);
            }
        },
        'check object with first property': {
            topic: function (spec) {
                var self = this;
                spec.isSatisfied({foo: 1}, function (err) {
                    self.callback(null, err);
                });
            },
            'should be raised for a second field': function (err, raise_errors) {
                assert.isNull(err);
                assert.isObject(raise_errors.bar);
                assert.isUndefined(raise_errors.foo);
            }
        },
        'check valid objects': {
            topic: function (spec) {
                spec.isSatisfied({foo: 1, bar: 2}, this.callback);
            },
            'should not be raised error': function (err, results) {
                assert.isNull(err);
            },
            'should be get result object': function (err, results) {
                assert.equal(results.foo, 1);
                assert.equal(results.bar, 2);
            }
        }
    },


    'three notEmpty, count up fields specification': {
        topic: function () {
            var spec = new Specification({
                foo: function (c, data, progress) {
                    c.notEmpty();
                    return Object.keys(progress).length + 1;
                },
                bar: function (c, data, progress) {
                    c.notEmpty();
                    return Object.keys(progress).length + 1;
                },
                baz: function (c, data, progress) {
                    c.notEmpty();
                    return Object.keys(progress).length + 1;
                }
            });

            this.callback(null, spec);
        },
        'check valid object': {
            topic: function (spec) {
                spec.isSatisfied({foo: 0, bar: 0, baz: 0}, this.callback);
            },
            'should be get result object': function (err, results) {
                assert.isNull(err);
                assert.equal(results.foo, 1);
                assert.equal(results.bar, 2);
                assert.equal(results.baz, 3);
            }
        },
        'check valid object with field orders': {
            topic: function (spec) {
                spec.orders(['baz', 'foo']);
                spec.isSatisfied({foo: 0, bar: 0, baz: 0}, this.callback);
            },
            'should be get result object': function (err, results) {
                assert.isNull(err);
                assert.equal(results.foo, 2);
                assert.equal(results.bar, 3);
                assert.equal(results.baz, 1);
            }
        }
    },

    'Two fields, If first field is valid, second field is ignores specification': {
        topic: function () {
            var spec = new Specification({
                foo: function (c, data, progress) {
                    if (c.notEmpty()) {
                        this.ignores(['bar']);
                    }
                },
                bar: function (c, data, progress) {
                    c.notEmpty();
                }
            });

            this.callback(null, spec);
        },
        'check blank object': {
            topic: function (spec) {
                var self = this;
                spec.isSatisfied({}, function (err) {
                    self.callback(null, err);
                });
            },
            'should be raised for two fields': function (err, raise_errors) {
                assert.isNull(err);
                assert.isObject(raise_errors.foo);
                assert.isObject(raise_errors.bar);
            }
        },
        'check only first field object': {
            topic: function (spec) {
                spec.isSatisfied({foo: 0}, this.callback);
            },
            'should be get result object': function (err, results) {
                assert.isNull(err);
                assert.equal(results.foo, 0);
            }
        },
        'ingore first field from outside and check blank object': {
            topic: function (spec) {
                var self = this;
                spec.ignores(['foo']);
                spec.isSatisfied({}, function (err) {
                    self.callback(null, err);
                });
            },
            'should be raised for second field': function (err, raise_errors) {
                assert.isNull(err);
                assert.isObject(raise_errors.bar);
                assert.isUndefined(raise_errors.foo);
            }
        }
    }

}).export(module);

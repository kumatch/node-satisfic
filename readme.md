A data validator by specification.
======

Install
--------

    $ npm install satisfic



Examples
--------

    var Satisfic = require('satisfic');
    
    var spec = Satisfic.spec({
        name: function (checker, data, process) {
            checker.notEmpty();
        },
        email: function (checker, data, process) {
            checker.notEmpty().isEmail();
        }
    });
    
    spec.isSatisfied({ name: 'kumatch', email: 'kumatch@example.com' }, function (err, results) {
        console.log(results.name);
        console.log(results.email);
    });


Checker (for validation object) in spec is [node-validator](https://github.com/chriso/node-validator), see detail.
var cls = require('continuation-local-storage');
var ns = cls.createNamespace('promise test')

var Promise = require('bluebird');
var clsBluebird = require('cls-bluebird');
 
clsBluebird( ns );

var promise;
ns.run(function() {
    ns.set('test', 2);
    promise = new Promise(function(resolve) {
      ns.set('a', 'a');
        ns.run(function() {
            ns.set('test', 1);
            resolve();
        });
    });
    var sdf = new Promise(function(resolve) {
      ns.set('a', 'b');
    });
    var pp = new Promise(function(resolve) {
      setTimeout(function() {
        console.log(ns.get('a'))
      }, 1000);
    });
});

ns.run(function() {
    ns.set('test', 3);
    promise.then(function() {
        console.log('This Promise implementation follows convention ' + ns.get('test'));
    });
});
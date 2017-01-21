var cls = require('continuation-local-storage');
var ns = cls.createNamespace('promise test')

var promise;
ns.run(function() {
    ns.set('test', 2);
    ns.set('a', 'init');
    promise = new Promise(function(resolve) {
      let context = ns.createContext();
      ns.enter(context);
      ns.set('a', 'a');
      ns.run(function() {
        console.log('==='+ns.get('a'))
          ns.set('test', 1);
          resolve();
      });
      ns.exit(context)
    });
    var sdf = new Promise(function(resolve) {
      let context = ns.createContext();
      ns.enter(context);
      ns.set('a', 'b');
      ns.exit(context)
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
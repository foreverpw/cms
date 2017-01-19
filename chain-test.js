var threadLocal = require('continuation-local-storage');
// var connectionLocal = threadLocal.createNamespace('db connection local');
threadLocal.createNamespace('db connection local');

setTimeout(function() {
    var connectionLocal = threadLocal.getNamespace('db connection local')
    connectionLocal.run(function() {
        connectionLocal.set('connection', {id:1});
        setTimeout(function() {
            console.log('thread1:'+connectionLocal.get('connection').id)
            setTimeout(function() {
                console.log('thread1-2:'+connectionLocal.get('connection').id)
                setTimeout(function() {
                    console.log('thread1-3:'+connectionLocal.get('connection').id)
                }, 1000);
            }, 1000);
        }, 1000);
    })
}, 500);

setTimeout(function() {
    var connectionLocal = threadLocal.getNamespace('db connection local')
    connectionLocal.run(function() {
        connectionLocal.set('connection', {id:2});
        setTimeout(function() {
            console.log('thread2:'+connectionLocal.get('connection').id)
        }, 1000);
    })
}, 1000);
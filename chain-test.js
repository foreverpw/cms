var cls = require('continuation-local-storage');
var co = require('co');
var ns = cls.createNamespace('test');

var Promise = require('bluebird');
var clsBluebird = require('cls-bluebird');
 
clsBluebird( ns );


function log(index){
    return new Promise(function (resolve, reject){
         console.log('cid:'+ns.get('cid')+',index:'+index)
         resolve()
    })
}

async function afn(){
    var a1 = await log(1)
    var a1 = await log(2)
}

function* gen(){
    var a1 = yield log(1)
    var a2 = yield log(2)
}

function newP(id){
    Promise.resolve().then((data)=>{
        ns.run(function(){
            ns.set('cid',id)
            // co(gen);
            co(afn)
        })
    })
}

newP(1);
newP(2);
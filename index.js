'use strict';


const { resolveAny } = require('dns');
const fs = require('fs');
const { stringify } = require('querystring');

const hashMap = new Map();

const finalip = new Map();
let curr =0;
var currl=[];
var newClicks = {};
newClicks['ip'] = [];
newClicks['timestamp'] = [];
newClicks['amount'] = [];

var validip =[];


fs.readFile('clicks.json', (err, data) => {
    if (err) throw err;
    let clicks = JSON.parse(data);

    clicks.forEach(function (item) {
        if(hashMap.has(item.ip)) {
            curr = hashMap.get(item.ip);
            curr = curr+1;
            
            hashMap.set(item.ip, curr);  
        }
        else {
            
            curr = 1;
            hashMap.set(item.ip, curr);
        }
    });
    clicks.forEach(function (item) {
        if(hashMap.get(item.ip)<=10) {
            newClicks['ip'].push(item.ip);
            newClicks['timestamp'].push(item.timestamp);
            newClicks['amount'].push(item.amount);
        }
    });
    
    var size= newClicks['ip'].length;
    var j,i;
    for( j=0 ; j<size; j++) {
        for( i =0; i<24 ; i++)
        {
            var str= newClicks['timestamp'][j];
            var ip= newClicks['ip'][j];
            var amount = newClicks['amount'][j];
            currl= [];
            currl.push(amount);
            currl.push(str);
            currl.push(ip);

            
            
            
            
            const res = parseInt(str.substring(10,12));
            if(finalip.has(ip+" "+res)) {
                var currt = finalip.get(ip+" "+res);
                
                
                if(currt[0] < amount)
                {
                    
                    finalip.set(ip+" "+res, currl);
                }
                 else if(currt[0] == amount && currt[1] > str )
                 {
                    
                    finalip.set(ip+" "+res, currl);
                }
            }
            else {
                
                
                finalip.set(ip+" "+res, currl);
            }
            

        
    }
};
    console.log(finalip);

    var answer = {};
    answer['ip']= [];
    finalip.forEach((values,keys)=>{ 
         
         answer['ip'].push(values);
       
      }) ;

   

    let newData = JSON.stringify(answer);
    
    
    fs.writeFileSync('resultset.json', newData);
    console.log('Data is written on resultset json');

});

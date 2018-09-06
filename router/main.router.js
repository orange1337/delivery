/*
* Created by Rost
*/
const exec  = require('child_process').exec;

module.exports = function(handler) {

        handler.on('error',  (err) => {
          console.error('Error:', err.message)
        });
        
        handler.on('push',  (event) => {
                let data = event.payload;
                console.log(data);

                if (!data || !data.repository || !data.repository.name){
                        console.log("Wrong data", data);
                }

                if (data.repository.name === "eos-monitor"){
                        console.log('====== running delivery eos-monitor', new Date());
                        exec('cd ~ && ./delivery.sh eos-monitor', { maxBuffer: 1024 * 1000000 }, (error, sdtout, stderror) => {
                              if (error) {
                                return console.error(error);
                              }
                              if (stderror) {
                                console.error('stderror', stderror);
                              }
                              console.log('sdtout', sdtout);
                              
                        });
                } else if (data.repository.name === "eos-monitor-back"){ 
                        console.log('====== running delivery eos-monitor', new Date());
                        exec('cd ~ && ./delivery.sh eos-monitor-back', { maxBuffer: 1024 * 1000000 }, (error, sdtout, stderror) => {
                              if (error) {
                                return console.error(error);
                              }
                              if (stderror) {
                                console.error('stderror', stderror);
                              }
                              console.log('sdtout', sdtout);
                             
                        });
                } else {
                   console.error("Repo not found!");     
                }       
        });
        
        handler.on('issues',  (event) => {
          console.log('Received an issue event for %s action=%s: #%d %s',
            event.payload.repository.name,
            event.payload.action,
            event.payload.issue.number,
            event.payload.issue.title)
        });

// ============== END of exports 
};


























/*
* Created by Rost
*/
const path 		= require('path');
const fs   		= require('fs');
const exec 		= require('child_process').exec;
const crypto            = require('crypto');
const secret 	        = "cryptolionsDelivery1337";

module.exports = function(router) {

	router.post('/delivery', (req, res) => {

		let data = req.body;
                let sign = req.headers['x-hub-signature'];

		if (!data  || !data.repository || !data.repository.name){
			console.log("Wrong data", data);
			return res.send(444, "Wrong data");
		}

                let createSign = signature(data);
		if (sign !== createSign){
                        console.log("Sign not equal", sign, createSign);
			return res.send(500, "Wrong secret", createSign);
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
                        res.end();
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
                        res.end();
		} else {
                   res.send("Repo not found!");     
                }	
		
	});

// ============== END of exports 
};

function signature (data) {
    return 'sha1=' + crypto.createHmac('sha1', secret).update(JSON.stringify(data)).digest('hex')
}


























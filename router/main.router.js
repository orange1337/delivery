/*
* Created by Rost
*/
const path 		= require('path');
const fs   		= require('fs');
const exec 		= require('child_process').exec;
const secret 	= "cryptolionsDelivery1337";

module.exports = function(router) {

	router.post('/delivery', (req, res) => {

		let data = req.body;

		if (!data || !data.hook || !data.hook.config || !data.hook.config.secret || 
			!data.repository || !data.repository.name){
			console.log("Wrong data", data);
			return res.send(444, "Wrong data");
		}

		if (data.hook.config.secret !== secret){
                        console.log(data.hook.config.secret);
			return res.send(500, "Wrong secret", data.hook.config.secret);
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
                   res.send(404, "Repo not found!");     
                }	
		
	});

// ============== END of exports 
};


























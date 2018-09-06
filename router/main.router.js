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
			return res.status(444).send("Wrong data");
		}

		if (data.hook.config.secret !== secret){
			return res.status(500).send("Wrong secret", data.hook.config.secret);
		}

		if (data.repository.name === "eos-monitor"){
			console.log('====== running delivery eos-monitor', new Date());
        	exec('cd ~ && ./delivery.sh eos-monitor', (error, sdtout, stderror) => {
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
        	exec('cd ~ && ./delivery.sh eos-monitor-back', (error, sdtout, stderror) => {
        	      if (error) {
        	        return console.error(error);
        	      }
        	      if (stderror) {
        	        console.error('stderror', stderror);
        	      }
        	      console.log('sdtout', sdtout);
        	});
		}	
		res.status(404).send("Repo not found!");
	});

// ============== END of exports 
};


























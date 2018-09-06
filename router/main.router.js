/*
* Created by Rost
*/
const path 		        = require('path');
const fs   		        = require('fs');
const exec 		        = require('child_process').exec;
const crypto            = require('crypto');
const secret            = 'cryptolionsDelivery1337';
const MAX_BUFFER        = Math.pow(1024, 3); // max 1gb for child process
const timeUpdates       = 1000; // update monitoring github webhooks requests

let STACK = [];

module.exports = (router) => {

	router.post('/delivery', (req, res) => {

		let data        = req.body;
        let sign        = req.headers['x-hub-signature'];
        let createSign  = signatureCreate(data);
        let repo        = data.repository.name;      

		if (!data  || !data.repository || !data.repository.name){
			console.log('====== Wrong data', data);
			return res.status(444).send('Wrong data');
		}

		if (sign !== createSign){
            console.log('====== Sign not equal', sign, createSign);
			return res.status(500).send(`Wrong secret: ${createSign}`);
		}

		if (repo === 'eos-monitor' || repo === 'eos-monitor-back'){
            STACK.push(data);
			return res.end();
		}

        console.log('====== Repo not found', repo);
        res.end();	
	});
    
    execMonitoringHooksRequests();
// ============== END of exports 
};

function execMonitoringHooksRequests(){
    if (STACK.length === 0){
        //console.log('STACK empty');
        return setTimeout(execMonitoringHooksRequests, timeUpdates);
    }
    let repo = STACK[0].repository.name;
    console.log(`====== running delivery ${repo}`, new Date());
    exec(`sh ~/delivery.sh ${repo}`, { maxBuffer: MAX_BUFFER }, (error, sdtout, stderror) => {
          if (error) {
               console.error('error', error);
          }
          if (stderror) {
               console.error('stderror', stderror);
          }
          STACK.shift();
          execMonitoringHooksRequests();
    });
}

function signatureCreate (data) {
    return 'sha1=' + crypto.createHmac('sha1', secret).update(JSON.stringify(data)).digest('hex')
}



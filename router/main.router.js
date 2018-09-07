/*
* Created by Rost
*/
const path 		      = require('path');
const fs   		      = require('fs');
const exec 		      = require('child_process').exec;
const crypto        = require('crypto');

module.exports = (router, config, logSlack) => {

  const secret        = config.secret;
  const MAX_BUFFER    = config.MAX_BUFFER;
  const timeUpdates   = config.timeUpdates;

  let STACK = [];

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

    console.log(`====== Repo not found ${repo}`);
    logSlack(`====== Repo not found ${repo}`);
    res.end();	
	});
    
  execMonitoringHooksRequests();

  function execMonitoringHooksRequests(){
    if (STACK.length === 0){
        //console.log('STACK empty');
        return setTimeout(execMonitoringHooksRequests, timeUpdates);
    }
    let repo = STACK[0].repository.name;
    console.log(`====== running delivery ${repo}`);
    exec(`sh ~/delivery.sh ${repo}`, { maxBuffer: MAX_BUFFER }, (error, sdtout, stderror) => {
          if (error){
               logSlack(`[${repo} deploy error] : ${error}`);
          }
          if (stderror){
               logSlack(`[${repo} deploy stderror] : ${stderror}`);
          }
          if (!stderror && !error){
               logSlack(`[${repo} deploy success]`);
          }
          STACK.shift();
          execMonitoringHooksRequests();
    });
  }
  
  function signatureCreate (data) {
      return 'sha1=' + crypto.createHmac('sha1', secret).update(JSON.stringify(data)).digest('hex')
  }

// ============== END of exports 
};



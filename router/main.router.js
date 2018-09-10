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
    let now = new Date();
    let utc_time = new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());

    console.log(`====== running deploy ${repo}`);
    exec(`sh ~/deploy.sh ${repo}`, { maxBuffer: MAX_BUFFER }, (error, sdtout, stderror) => {
          if (error){
               logSlack(`[${utc_time}][${repo} deploy error] : ${error}`);
          }
          if (stderror){
               console.error('\x1b[36m%s\x1b[0m', `===== [${utc_time}] [${repo} deploy stderror] : ${stderror}`);
          }
          if (!error){
               logSlack(`[${utc_time}][${repo} deploy success]`);
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



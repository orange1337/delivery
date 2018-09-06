/*
* Created by Rost
*/
const path 		    = require('path');
const fs   		    = require('fs');
const exec 		    = require('child_process').exec;
const crypto        = require('crypto');
const secret        = 'cryptolionsDelivery1337';
const MAX_BUFFER    = Math.pow(1024, 3); // max 1gb for child process

module.exports = (router) => {

	router.post('/delivery', (req, res) => {

		let data        = req.body;
        let sign        = req.headers['x-hub-signature'];
        let createSign  = signatureCreate(data);
        let repo        = data.repository.name;      

		if (!data  || !data.repository || !data.repository.name){
			console.log('====== Wrong data', data);
			return res.send(444, 'Wrong data');
		}

		if (sign !== createSign){
            console.log('====== Sign not equal', sign, createSign);
			return res.send(500, `Wrong secret: ${createSign}`);
		}

		if (repo !== 'eos-monitor' || repo !== 'eos-monitor-back'){
            console.log('====== Repo not found');
			return res.end();
		}

        console.log('====== running delivery eos-monitor', new Date());
        exec(`sh ~/delivery.sh ${repo}`, { maxBuffer: MAX_BUFFER }, (error, sdtout, stderror) => {
              if (error) {
                    return console.error(error);
              }
              if (stderror) {
                    console.error('stderror', stderror);
              }
              console.log('sdtout', sdtout);
        });
        res.end();	
	});

// ============== END of exports 
};

function signatureCreate (data) {
    return 'sha1=' + crypto.createHmac('sha1', secret).update(JSON.stringify(data)).digest('hex')
}


























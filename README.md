# Delivery deploy server with Slack notifications

## Manual installation 
	- node.js v.8^ https://nodejs.org
	- sudo npm i -g pm2

## Deploy app
    - clone repo from github
	- cd /delivery
	- npm i

## Create config.js 
For creating `config.js` file you need to see `config.example.js` (default config)

## delivery.sh script example in root dir
    `#!/bin/sh
     dir_name=$1
     cd ~/$dir_name
     git pull origin master
     cd ..
     docker-compose up --build -d`

## Start server
    `pm2 start server.js`

## Other pm2 commands
    - pm2 list
    - pm2 logs server
    - pm2 stop server
    - pm2 restart server

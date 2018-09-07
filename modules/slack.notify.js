/*
   Created by eoswebnetbp1
*/
'use strict';

const slack = require('slack');

function slackAppender(config) {
  let now = new Date();
  let utc_time = new Date(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes());
  
  return (loggingEvent) => {
    console.log('\x1b[33m%s\x1b[0m', loggingEvent);
    const data = {
      token: config.token,
      channel: config.channel_id,
      text: `[${utc_time}] ${loggingEvent}`,
      icon_url: config.icon_url,
      username: config.username
    };

    slack.chat.postMessage(data, (err) => {
      if (err) {
        console.error('log4js:slack - Error sending log to slack: ', err);
      }
    });
  };
}

function configure(config) {
  return slackAppender(config);
}

module.exports.configure = configure;
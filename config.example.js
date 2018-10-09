let config = {};

// max buffer size for child processes - 1gb
config.MAX_BUFFER = Math.pow(1024, 3);

// update monitoring github webhooks requests
config.timeUpdates = 1000;

// secret for github hook
config.pointUrl  = '/delivery';
config.secret    = 'yourSecretGithubHook';

config.repoNames = ['eos-monitor', 'eos-monitor-back'];

config.deployScriptPath = "~/";

// slack notifications
config.loggerSlack = {
      alerts: {
        type: 'slack',
        token: '',
        channel_id: 'deploy-notify',
        username: 'Delivery bot',
      }
};

module.exports = config;
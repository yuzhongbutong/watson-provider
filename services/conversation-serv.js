var Conversation = require('watson-developer-cloud/conversation/v1');
var vcapServices = require('vcap_services');
var configSecret = require('../utils/config-secret.json');

var credentials = vcapServices.getCredentials('conversation');
var conversation = new Conversation({
    username: credentials.username || process.env.CONVERSATION_USERNAME,
    password: credentials.password || process.env.CONVERSATION_PASSWORD,
    url: credentials.url || configSecret.conversation_url,
    version_date: Conversation.VERSION_DATE_2017_04_21
});

exports.getConversation = function(payload, callback) {
    conversation.message(payload, function(err, data) {
        if (err) {
            return res.status(err.code || 500).json(err);
        }
        callback(data);
    });
};

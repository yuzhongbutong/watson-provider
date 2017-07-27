var Promise = require('bluebird');
var vcapServices = require('vcap_services');
var Conversation = require('watson-developer-cloud/conversation/v1');
var configSecret = require('../../utils/config-secret.json');

var credentials = vcapServices.getCredentials('conversation');
var conversation = new Conversation({
    username: credentials.username || process.env.CONVERSATION_USERNAME,
    password: credentials.password || process.env.CONVERSATION_PASSWORD,
    url: credentials.url || configSecret.conversation_url,
    version_date: Conversation.VERSION_DATE_2017_04_21
});

var context = {};

exports.getConversation = function (request, response) {
    var inputText = request.slot('word');
    var payload = {
        workspace_id: process.env.WORKSPACE_ID,
        context: context,
        input: {
            text: inputText
        }
    };
    return new Promise(function(resolve, fail){
        conversation.message(payload, function(err, data) {
            if (err) {
                fail(err);
            } else {
                context = data.context;
                resolve(data);
            }
        });
    });
}
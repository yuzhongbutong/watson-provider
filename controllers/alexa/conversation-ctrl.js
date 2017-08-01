var Promise = require('bluebird');
var conversationServ = Promise.promisifyAll(require('../../services/alexa/conversation-serv'));

exports.getLaunch = function (request, response) {
    response.say("You launched watson.");
};

exports.getConversation = function(request, response) {
    return conversationServ.getConversation(request, response).then(function (data) {
        response.say(data.output.text[0]);
    }).catch(function (err) {
        console.log(err);
        response.say('Bad request.');
    });
};
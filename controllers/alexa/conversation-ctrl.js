var Promise = require('bluebird');
var conversationServ = Promise.promisifyAll(require('../../services/alexa/conversation-serv'));

exports.getLaunch = function (request, response) {
    response.say("You launched watson.");
};

exports.getConversation = function(request, response) {
    response.shouldEndSession(false);
    console.log(request.sessionId);
    return conversationServ.getConversation(request, response).then(function (data) {
        response.say(data.output.text.join('. '));
    }).catch(function (err) {
        console.log(err);
        response.say('Bad request.');
    });
};

exports.stopConversation = function (request, response) {
    response.stop();
};

exports.cancelConversation = function (request, response) {
    response.stop();
};
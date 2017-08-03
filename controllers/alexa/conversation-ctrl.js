var util = require('util');
var Promise = require('bluebird');
var conversationServ = Promise.promisifyAll(require('../../services/alexa/conversation-serv'));

exports.getLaunch = function (request, response) {
    response.say("You launched watson.");
};

exports.getConversation = function(request, response) {
    response.shouldEndSession(false);
    return conversationServ.getConversation(request, response).then(function (data) {
        var output = data.output.text.join(' ');
        if (data.output.result && data.output.result.from_date && data.output.result.to_date) {
            var result = conversationServ.getDataByDate(data.output.result);
            if (result) {
                output += result;
            } else {
                output = util.format('There is no record between %s and %s.', data.output.result.from_date, data.output.result.to_date);
            }
        }
        response.say(output);
    }).catch(function (err) {
        console.log(err);
        response.say('Bad request.');
    });
};

exports.stopConversation = function (request, response) {
    var stopOutput = "Don't You Worry. I'll be back.";
    response.say(stopOutput);
    return;
};

exports.cancelConversation = function (request, response) {
    var cancelOutput = "No problem. Request cancelled.";
    response.say(cancelOutput);
    return;
};
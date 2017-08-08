var util = require('util');
var Promise = require('bluebird');
var conversationServ = Promise.promisifyAll(require('../../services/alexa/conversation-serv'));

exports.getLaunch = function (request, response) {
    response.shouldEndSession(false);
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

exports.getConversationMulti = function(request, response) {
    response.shouldEndSession(false);
    var dataAll = [];
    return conversationServ.getConversationMulti(request, process.env.WORKSPACE_ID_CHECK).then(function (data) {
        dataAll.push(data);
        return conversationServ.getConversationMulti(request, process.env.WORKSPACE_ID_TRANSFER);
    }).then(function (data) {
        dataAll.push(data);
        console.log(JSON.stringify(dataAll));
        var result = check(dataAll);
        response.say(result);
    }).catch(function (err) {
        console.log(err);
        response.say('Bad request.');
    });
};

function check(dataAll) {
    if (dataAll[0].intents.length && dataAll[1].intents.length && dataAll[0].entities.length && dataAll[1].entities.length) {
        var checkA = getValue('account', dataAll[0].entities);
        var check = 200; // 根据账号（checkA）从DB查询余额

        var transfer = getValue('SUM', dataAll[1].entities);
        var transferA = getValue('from-account', dataAll[1].entities);
        var transferB = getValue('to-account', dataAll[1].entities);

        if (transfer <= check && checkA && transfer && transferA && transferB) {
            return 'balance of ' + checkA + ' is ' + check + ' dollars, ' + transfer + ' dollars is transferred from ' + transferA + ' to ' + transferB;
        } else {
            return 'Your balance is not enough.';
        }
    } else if (dataAll[0].intents.length && dataAll[0].entities.length) {
        var checkA = getValue('account', dataAll[0].entities);
        var check = 200; // 根据账号（checkA）从DB查询余额
        if (checkA) {
            return 'Balance of ' + checkA + ' is ' + check + ' dollars.';
        }
    } else if (dataAll[1].intents.length && dataAll[1].entities.length) {
        var transfer = getValue('SUM', dataAll[1].entities);
        var transferA = getValue('from-account', dataAll[1].entities);
        var transferB = getValue('to-account', dataAll[1].entities);
        if (transfer && transferA && transferB) {
            return transfer + ' dollars is transferred from ' + transferA + ' to ' + transferB;
        }
    }
    return 'Sorry, I can not do that.';
}

function getValue(key, array) {
    for (var i = 0; i < array.length; i++) {
        if (key === array[i]['entity']) {
            return array[i]['value'].substring(1, array[i]['value'].length - 1);
        }
    }
}
var util = require('util');
var Promise = require('bluebird');
var vcapServices = require('vcap_services');
var Conversation = require('watson-developer-cloud/conversation/v1');
var configSecret = require('../../utils/config-secret.json');
var record = require('../../data/record.json');

var credentials = vcapServices.getCredentials('conversation');
var conversation = new Conversation({
    username: credentials.username || process.env.CONVERSATION_USERNAME,
    password: credentials.password || process.env.CONVERSATION_PASSWORD,
    url: credentials.url || configSecret.conversation_url,
    version_date: Conversation.VERSION_DATE_2017_04_21
});

exports.getConversation = function (request, response) {
    var session = request.getSession();
    var context = session.get('alexaContext');
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
                session.set('alexaContext', data.context);
                resolve(data);
            }
        });
    });
};

exports.getDataByDate = function(params) {
    var result = '';
    for (var i = 0; i < record.trading_record.length; i++) {
        var tradingRecord = record.trading_record[i];
        if (tradingRecord.date >= params.from_date && tradingRecord.date <= params.to_date) {
            result += util.format(' on %s you spent %s dollars in %s.', tradingRecord.date, tradingRecord.money, tradingRecord.place);
        }
    }
    return result;
}
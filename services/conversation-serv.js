var Conversation = require('watson-developer-cloud/conversation/v1');
var common = require('../utils/common');

var credentials = common.getServices('conversation')[0].credentials;
var conversation = new Conversation({
    username: credentials.username,
    password: credentials.password,
    url: credentials.url,
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

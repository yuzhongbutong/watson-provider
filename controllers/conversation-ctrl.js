var conversationServ = require('../services/conversation-serv');
var common = require('../utils/common');

exports.getExpress = function(req, res, next) {
    res.render('index', { title: 'Express' });
};

var context = {};

exports.getConversation = function(req, res, next) {
    var payload = {
        workspace_id: process.env.WORKSPACE_ID,
        context: context,
        input: {
            text: req.body.inputText
        }
    };
    conversationServ.getConversation(payload, function (data) {
        context = data.context;
        return res.json(data);
    });
};

var speechTokenServ = require('../services/speech-serv');

exports.getStt = function(req, res, next) {
    res.render('stt');
};

exports.getTts = function(req, res, next) {
    res.render('tts');
};

exports.getUpload = function(req, res, next) {
    res.render('stt-file');
};

exports.getUploadText = function(req, res, next) {
    speechTokenServ.getUploadText(req.file.path, function (result) {
        res.send(result);
    });
};

exports.getSpeechToken = function (req, res, next) {
    var category = req.params.category;
    speechTokenServ.getSpeechToken(category, function (err, token) {
        if (err) {
            console.log('Error retrieving token: ', err);
            res.status(500).send('Error retrieving token');
            return;
        }
        res.send(token);
    });
};
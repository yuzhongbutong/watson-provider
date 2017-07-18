var fs = require('fs');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var extend = (extend = require('util')._extend);
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var configSecret = require('../utils/config-secret.json');

var speech_to_text = new SpeechToTextV1({
    username: configSecret.stt_credentials.username,
    password: configSecret.stt_credentials.password
});

var params = {
    content_type: 'audio/wav'
};

var speechConfig = {
    stt: extend(
        {
            version: 'v1',
            url: configSecret.stt_credentials.url,
            username: process.env.STT_USERNAME || configSecret.stt_credentials.username,
            password: process.env.STT_PASSWORD || configSecret.stt_credentials.password
        },
        vcapServices.getCredentials('speech_to_text')
    ),
    tts: extend(
        {
            version: 'v1',
            url: configSecret.tts_credentials.url,
            username: process.env.TTS_USERNAME || configSecret.tts_credentials.username,
            password: process.env.TTS_PASSWORD || configSecret.tts_credentials.password
        },
        vcapServices.getCredentials('text_to_speech')
    )
};

exports.getUploadText = function (path, callback) {
    var recognizeStream = speech_to_text.createRecognizeStream(params);
    fs.createReadStream(path).pipe(recognizeStream);
    recognizeStream.setEncoding('utf8');
    recognizeStream.on('data', function (result) {
        callback(result);
    });
}

exports.getSpeechToken = function (category, callback) {
    var sttAuthService = watson.authorization(speechConfig[category]);
    sttAuthService.getToken({url: speechConfig[category].url}, function (err, token) {
        callback(err, token);
    });
};
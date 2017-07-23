var fs = require('fs');
var watson = require('watson-developer-cloud');
var vcapServices = require('vcap_services');
var extend = (extend = require('util')._extend);
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var configSecret = require('../utils/config-secret.json');

var stt_credentials = vcapServices.getCredentials('speech_to_text');
var tts_credentials = vcapServices.getCredentials('text_to_speech');
var speech_to_text = new SpeechToTextV1({
    username: stt_credentials.username || process.env.SPEECH_TO_TEXT_USERNAME,
    password: stt_credentials.password || process.env.SPEECH_TO_TEXT_PASSWORD
});

var params = {
    content_type: 'audio/wav'
};

var speechConfig = {
    stt: extend(
        {
            version: 'v1',
            url: stt_credentials.url || configSecret.stt_url,
            username: stt_credentials.username || process.env.SPEECH_TO_TEXT_USERNAME,
            password: stt_credentials.password || process.env.SPEECH_TO_TEXT_PASSWORD
        },
        stt_credentials
    ),
    tts: extend(
        {
            version: 'v1',
            url: tts_credentials.url || configSecret.tts_url,
            username: tts_credentials.username || process.env.TEXT_TO_SPEECH_USERNAME,
            password: tts_credentials.password || process.env.TEXT_TO_SPEECH_PASSWORD
        },
        tts_credentials
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
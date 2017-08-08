var express = require('express');
var alexa = require("alexa-app");
var multer = require ('multer');
var speechTokenCtrl = require('../controllers/speech-ctrl');
var conversationCtrl = require('../controllers/conversation-ctrl');
var alexaConversationCtrl = require("../controllers/alexa/conversation-ctrl");
var router = express.Router();
var app = new alexa.app("alexa/api");

var upload = multer({ dest:  "../temp" });

app.launch(alexaConversationCtrl.getLaunch);

app.intent("conversationIntent", alexaConversationCtrl.getConversation);

app.intent("balanceIntent", alexaConversationCtrl.getConversationMulti);

app.intent("AMAZON.StopIntent", alexaConversationCtrl.stopConversation);

app.intent("AMAZON.CancelIntent", alexaConversationCtrl.cancelConversation);


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/stt', speechTokenCtrl.getStt);

router.get('/tts', speechTokenCtrl.getTts);

router.get('/upload', speechTokenCtrl.getUpload);

router.post('/api/speech/upload', upload.single('speech'), speechTokenCtrl.getUploadText);

router.get('/api/speech/token/:category', speechTokenCtrl.getSpeechToken);

router.post('/api/conversation', conversationCtrl.getConversation);

app.express({router: router, checkCert: false, debug: true});
module.exports = router;

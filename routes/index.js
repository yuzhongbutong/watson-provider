var express = require('express');
var multer = require ('multer');
var speechTokenCtrl = require('../controllers/speech-ctrl');
var conversationCtrl = require('../controllers/conversation-ctrl');
var router = express.Router();

var upload = multer({ dest:  "../temp" });

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

module.exports = router;

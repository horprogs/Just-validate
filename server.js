var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/check-correct', function (req, res) {
    if (req.query.email === 'ok@test.com') {
        res.send('OK');
        return;
    }
    res.send('false');
});

app.post('/submit', function (req, res) {
    res.send('OK');
});

app.get('/check-wrong', function (req, res) {
    res.send('false');
});

app.listen(7777, function () {
    console.log('API server on port 7777!');
});
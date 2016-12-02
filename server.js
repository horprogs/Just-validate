var express = require('express');
var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/check-correct', function (req, res) {
    res.send('OK');
});

app.get('/check-wrong', function (req, res) {
    res.send('false');
});

app.listen(7777, function () {
    console.log('API server on port 7777!');
});
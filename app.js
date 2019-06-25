'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require("morgan");
const unhandledRejection = require('unhandled-rejection');
const rejectionEmitter = unhandledRejection({ timeout: 20 });
const jwt = require('express-jwt');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nipun:qwe123qwe123@localdata-tmzju.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

require('dotenv').config();
const app = express();

let authenticate = jwt({
    secret: new Buffer(process.env.JWT_CLIENT_SECRET, 'base64'),
    audience: process.env.JWT_CLIENT_AUDIENCE,
    algorithm: process.env.JWT_ALGO
});
const general = require('./services/general');

app.use(['/v1'], function (req, res, next) {
    let decoded_token;
    let current_timestamp = new Date().getTime() / 1000;
    general.jwtVerifyAndDecode(req.headers.authorization).then((_decoded_token) => {
        decoded_token = _decoded_token;
        if (decoded_token.exp < current_timestamp) {
            throw new Error('ExpiredToken');
        }
        return authenticate(req, res, function (error) {
            if (error)
                return res.status(401).send(error);
            return next();
        })
    }).catch((error) => {
        if (error.message == 'ExpiredToken')
            return res.status(401).send('Token expired');
        return res.status(401).send(error);
    });;
});


app.use(morgan('":remote-addr",":remote-user",":method",":url",":status",":res[content-length]",":response-time","[:date[clf]]"'));

app.use(cors({
    origin: true,
    allowedHeaders: ['X-Total-Pages', 'Authorization', 'Accept', 'Content-Type'],
    exposedHeaders: ['X-Total-Pages', 'Link', 'X-Items-Per-Page', 'X-Total-Items']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(require('./routes/index'));

rejectionEmitter.on("unhandledRejection", (error, promise) => {
    console.log("Error in unhandledRejection:", error);
});

app.listen(process.env.PORT, error => {
    if (error) {
        console.log(error);
    } else {
        console.log('Server running at  ' + process.env.PORT);
    };
});
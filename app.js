const mongoose = require('mongoose');
const express = require('express');
const path = require("path");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');


const app = express();

require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(helmet.contentSecurityPolicy(
    {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["*"],
            imgSrc: ["*", "data:"],
            frameSrc: ["*"],
            connectSrc: ["'self'"],
        }
    })
);
app.use(cors({
    origin: 'http://localhost:3000'
}));
// CSP 설정을 수정하여 localhost:3001을 허용합니다.
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:3001"]
    }
}));

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api', require('./router/index'));
app.use('/api/asset', require('./router/assetRouter'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//mongoose
const db = require("./models");
db.mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("데이터베이스 연결 수립 성공!");
    })
    .catch(err => {
        console.log("데이터베이스 연결 수립 실패!", err);
        process.exit();
    });


module.exports = app;
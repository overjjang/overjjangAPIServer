var express = require('express');
var path = require('path');
const router = express.Router();

router.use('/PUBG/erangel', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/images/PUBG/erangel.jpg'));
});

router.use('/PUBG/taego', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/images/PUBG/taego.jpg'));
});

router.use('/PUBG/vikendi', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/images/PUBG/vikendi.jpg'));
});

router.use('/PUBG/paramo', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/images/PUBG/paramo.jpg'));
});

module.exports = router;
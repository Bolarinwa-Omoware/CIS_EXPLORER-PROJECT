const express = require('express');
const cors = require('cors');
const app = express();

// var whitelist = ['http://localhost:3000', 'http://localhost:3443', 'http://localhost:4200'];


var corsOptionsDelegate = (req, callback) => {

    console.log(req.header('Origin'));

    var corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200
    };


    // if (whitelist.indexOf(req.header('Origin')) !== -1) {
    //     corsOptions = { origin: true, optionsSuccessStatus: 200 };
    // } else {
    //     corsOptions = { origin: false };
    // }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
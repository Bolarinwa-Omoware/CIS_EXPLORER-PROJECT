const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dxfparsing = require('dxf-parsing');
const dxf = dxfparsing.Parser;

const authenticate = require('../authenticate');
const cors = require('./cors');

const PropertyVat = require('../models/propertyVat');

const dxfFileReader = require('../modelLibs/dxfFileReader');
const coordProjection = require('../modelLibs/coordProjection');
const loadJsonFile = require('load-json-file');


const propertyVatRouter = express.Router();

propertyVatRouter.use(bodyParser.json());



propertyVatRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });


/**
 * POSTING A NEW GEOJSON FEATURES FOR PROPERTY VAT AND 
 * TAX PAYMENT TO THE MONGODB SERVER
 */
propertyVatRouter.post('/properties', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // let projType = req.query.projType;
    let filepath = req.query.path;

    loadJsonFile(filepath).then(json => {
        // data = coordProjection.projGeoJsonRequestBody(json, projType)
        // console.log(data.data.features[0].geometry.coordinates[0]);
        PropertyVat.create(json)
            .then((features) => {
                // console.log('Features Created ', features);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(features);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


});


/**
 * API TO GET A SPECIFIC LAYER DOCUMENT FORM THE DATABASE 
 */
propertyVatRouter.route('/vatdata')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        // var layerName = req.query.layer;
        var ppty_use = req.query._id;
        PropertyVat.findById(ppty_use)
            // .populate('comments.author')
            .then((lay) => {
                if (lay != null) {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(lay);

                } else {
                    err = new Error('Layer ' + ppty_use + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })





module.exports = propertyVatRouter;

// User.find({})
//     .then((users) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(users);
//     }, (err) => next(err))
//     .catch((err) => next(err));
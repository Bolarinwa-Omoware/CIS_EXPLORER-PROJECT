const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dxfparsing = require('dxf-parsing');
const dxf = dxfparsing.Parser;

const authenticate = require('../authenticate');
const cors = require('./cors');

const GeoFeatures = require('../models/geoFeatures');

const dxfFileReader = require('../modelLibs/dxfFileReader');
const coordProjection = require('../modelLibs/coordProjection');
const loadJsonFile = require('load-json-file');
const IncomingForm = require('formidable').IncomingForm;


const geoFeaturesRouter = express.Router();

geoFeaturesRouter.use(bodyParser.json());



geoFeaturesRouter.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

/**
 * CONVERTION OF DXF FILE TO GEOJSON
 */
// geoFeaturesRouter.post('/uploadDXF', cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {

//     let form = new IncomingForm();


//     form.on('file', (field, file) => {
//         // Do something with the file
//         // e.g. save it to the database
//         // you can access it using file.path
//         console.log(file.path);

//     });

//     form.on('end', () => {
//         res.json();
//     });
//     form.parse(req);



//     // form.on('end', () => {
//     //     res.statusCode = 200;
//     //     res.setHeader('Content-Type', 'application/json');
//     //     res.json(featuresCollection);
//     //     // res.json();
//     // });
//     // form.parse(req);

// });


/**
 * POSTING A NEW GEOJSON FEATURES TO THE MONGODB SERVER
 */
geoFeaturesRouter.post('/features', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    let projType = req.query.projType;
    let filepath = req.query.path;

    console.log(filepath);

    loadJsonFile(filepath).then(json => {
        data = coordProjection.projGeoJsonRequestBody(json, projType)
        console.log(data.data.features[0].geometry.coordinates[0]);
        GeoFeatures.create(data)
            .then((features) => {
                // console.log('Features Created ', features);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(features);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


    // req.body = 
    // console.log(req.body.data.features[0].geometry.coordinates);


});


/**
 * API TO GET A SPECIFIC LAYER DOCUMENT FORM THE DATABASE 
 */
geoFeaturesRouter.route('/layer')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        var layerName = req.query.layer;
        GeoFeatures.findOne({ 'layer': layerName })
            // .populate('comments.author')
            .then((lay) => {
                if (lay != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(lay);
                } else {
                    err = new Error('Layer ' + layerName + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    // Posting additional feature to a specific layer document
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        let layerName = req.query.layer;
        let projType = req.query.projType;

        GeoFeatures.findOne({ 'layer': layerName })
            .then((lay) => {
                if (lay != null) {
                    // req.body.author = req.user._id;
                    store = [];
                    for (let k = 0; k < req.body.length; k++) {
                        data = coordProjection.projFeatureRequestBody(req.body[k], projType);
                        store.push(data);
                        lay.data.features.push(data);
                    }

                    lay.save()
                        .then((adLay) => {
                            GeoFeatures.findById(adLay._id)
                                // .populate('comments.author')
                                .then((adLay) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(adLay);
                                })
                        }, (err) => next(err));

                } else {
                    err = new Error('Layer ' + layerName + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /feature/' +
            req.params.dishId + '/comments');
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdminUser,
        (req, res, next) => {
            let layerName = req.query.layer;
            GeoFeatures.findOne({ 'layer': layerName })
                .then((layer) => {
                    if (layer != null) {
                        for (var i = (layer.data.features.length - 1); i >= 0; i--) {
                            layer.data.features.id(layer.data.features[i]._id).remove();
                        }
                        layer.save()
                            .then((layer) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(layer);
                            }, (err) => next(err));
                    } else {
                        err = new Error('Layer ' + layerName + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        });



module.exports = geoFeaturesRouter;

// User.find({})
//     .then((users) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(users);
//     }, (err) => next(err))
//     .catch((err) => next(err));
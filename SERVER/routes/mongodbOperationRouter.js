const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs-extra');
const dxfparsing = require('dxf-parsing');
const loadJsonFile = require('load-json-file');
const dxf = dxfparsing.Parser;
const ogr2ogr = require('ogr2ogr');

const csv2json = require('../models/toJsonObj').csv2json;
const csv = require('csvtojson');

const dxfFileReader = require('../modelLibs/dxfFileReader');
const coordProjection = require('../modelLibs/coordProjection');
const gdal = require("gdal");
const cors = require('./cors');
const GeoJSON = require('geojson');

const decompress = require('decompress');

const GeoFeatures = require('../models/geoFeatures');


const mongodbOperationRouter = express.Router();
mongodbOperationRouter.use(bodyParser.json());


let filepath;
let data;


mongodbOperationRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {

        GeoFeatures.find(req.query)
            .then((features) => {

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(features);
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdminUser, (req, res, next) => {
        // usage
        uploadNewFeature(req, res, next).then(function(data) {

            let newFeature = new GeoFeatures(data);
            newFeature.save().then(dat => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dat);

                }, (err) => next(err))
                .catch((err) => console.log(err));

        }, function(err) {
            console.log("Error! " + err);
        });

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT OPERATION NOT SUPORTED HERE'); // Updating not allowed
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE OPERATION IS NOT SUPORTED ON THIS ROUTER OUTLET'); // Updating not allowed
    });



mongodbOperationRouter.route('/:featureCollectionId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        GeoFeatures.findById(req.params.featureCollectionId)
            .then((feaColl) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(feaColl);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdminUser,
        (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /mongodbServer/' + req.params.featureCollectionId);
        })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdminUser,
        (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /mongodbServer/' + req.params.featureCollectionId);
        })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdminUser,
        (req, res, next) => {
            GeoFeatures.findByIdAndRemove(req.params.featureCollectionId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        });


/**
 * Function to upload a new feature into the database
 * @param {*} req 
 * @param {*} res 
 */
function uploadNewFeature(req, res, next) {
    return new Promise((resolve, reject) => { //create a new promise
        processNewFeatureFile(req, res, (response) => {
            if (response !== undefined) {

                ogr2ogr(filepath).exec(function(er, dat) {
                    if (er) console.error(er);
                    data = dat;
                    data.name = req.query.name;
                    // data.features[0].properties["Lenght"] = 35;

                    if (req.query.projection === 'EPSG:26331') {
                        data.features.forEach(feature => {
                            feature.geometry.coordinates = [coordProjection.projMinna31_Wgs(
                                feature.geometry.coordinates,
                                feature.geometry.type)];
                        });

                    } else if (req.query.projection === 'EPSG:26332') {
                        data.features.forEach(feature => {
                            feature.geometry.coordinates = [coordProjection.projMinna32_Wgs(
                                feature.geometry.coordinates,
                                feature.geometry.type)];
                        });
                    }

                    //remove file
                    //With a callback:
                    fs.remove(filepath, err => {
                        if (err) return console.error(err)
                        console.log(filepath + ' removed successfully!')
                    });
                    resolve(data);

                });


            } else {
                var reason = new Error('file can not be process');
                reject(reason); // reject
            }
        });
    });
}

function processNewFeatureFile(req, res, callback) {

    var form = new IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = "public"; //set upload directory
    form.keepExtensions = true; //keep file extension


    form.on('file', (field, file) => {
        // Do something with the file
        // e.g. save it to the database
        // you can access it using file.path

        //TESTING
        console.log("file size: " + JSON.stringify(file.size));
        console.log("file path: " + JSON.stringify(file.path));
        console.log("file name: " + JSON.stringify(file.name));
        console.log("file type: " + JSON.stringify(file.type));
        console.log("astModifiedDate: " + JSON.stringify(file.lastModifiedDate));


        // Formidable changes the name of the uploaded file
        // Rename the file to its original name
        fs.rename(file.path, './public/' + file.name, function(err) {
            if (err)
                throw err;
            console.log('renamed complete');
            filepath = './public/' + file.name;
        });
    });

    form.on('end', () => {

        console.log('Layer Name: ', req.query.name);
        console.log('Projection Name: ', req.query.projection);


        setTimeout(() => {
            callback(filepath);
            // res.json();
        }, 400);

    });
    form.parse(req);


}


module.exports = mongodbOperationRouter;












// ogr2ogr(filepath).exec(function(er, data) {
//     if (er) console.error(er);
//     data.name = req.query.name;
//     console.log(JSON.stringify(data, null, ' '));
//     featuresCollection.push(data.features[0].geometry);

//     // res.statusCode = 200;
//     // res.setHeader('Content-Type', 'application/json');
//     // res.json(featuresCollection);

// });

// remove file
// With a callback:
// fs.remove(filepath, err => {
//     if (err) return console.error(err)
//     console.log(filepath + ' removed successfully!')
// });
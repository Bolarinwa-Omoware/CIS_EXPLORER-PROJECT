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

const decompress = require('decompress');
// const upload2Server = require('../modelLibs/uploadFile2server');

const allFileUploadRouter = express.Router();
allFileUploadRouter.use(bodyParser.json());


let filepath;


allFileUploadRouter.route('/')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        let proj = req.query.proj;
        console.log('proj = ', proj);

        dxf.toArray(filepath, (err, sectionTab) => {
            let featuresCollection;
            if (err) {
                err = new Error('File ' + filepath + ' not found');
                err.status = 404;
                return next(err);
            } else {
                let polygons = dxf.getPolygons(sectionTab);

                //Extract layers
                // allLayers = dxf.getAllLayers(sectionTab);
                // console.log(allLayers);
                // console.log('-----------------------------------------------------------------');

                layersByEntities = dxf.getLayersByEntities(sectionTab, ["text", "polygon", "circle"]);

                featuresCollection = dxfFileReader.geoJson();

                for (let j = 0; j < layersByEntities["polygon"].length; j++) {
                    let poly_points = polygons[layersByEntities["polygon"][j]][0].points;
                    let firstpoint = [poly_points[0].x, poly_points[0].y];
                    let coordinates = [];

                    for (let i = 0; i < poly_points.length; i++) {

                        let point = [poly_points[i].x, poly_points[i].y];
                        coordinates.push(point);

                    }
                    coordinates.push(firstpoint);
                    let coordProj;
                    if (proj === '0') {
                        coordProj = coordinates;
                        proj = undefined;
                    } else if (proj === '1') {
                        coordProj = coordProjection.projMinna31_Wgs(coordinates, 'dxfPolygon');
                        proj = undefined;
                    } else if (proj === '2') {
                        coordProj = coordProjection.projMinna32_Wgs(coordinates, 'dxfPolygon');
                        proj = undefined;
                    }


                    featuresCollection.features.push(dxfFileReader.toFeature("Polygon",
                        coordProj, layersByEntities["polygon"][j]));

                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(featuresCollection);

                // remove file
                // With a callback:
                fs.remove(filepath, err => {
                    if (err) return console.error(err)

                    console.log(filepath + ' removed successfully!')
                }); // remove file
                // With a callback:
                fs.remove(filepath, err => {
                    if (err) return console.error(err)

                    console.log(filepath + ' removed successfully!')
                });

            }
        });

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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


            //Formidable changes the name of the uploaded file
            //Rename the file to its original name
            fs.rename(file.path, './public/' + file.name, function(err) {
                if (err)
                    throw err;
                console.log('renamed complete');
                filepath = './public/' + file.name;
            });
        });

        form.on('end', () => {
            res.json();

        });
        form.parse(req);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT OPERATION NOT SUPORTED HERE'); // Updating not allowed
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE OPERATION IS NOT SUPORTED ON THIS ROUTER OUTLET'); // Updating not allowed
    });



allFileUploadRouter.route('/:cvsFile')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {


        const MyData = [];
        console.log("filepath:- ", filepath);


        csv()
            .fromFile(filepath)
            .on('json', (jsonObj) => {
                // combine csv header row and csv line to a json object
                // jsonObj.a ==> 1 or 4
                MyData.push([jsonObj.PB, jsonObj.Easting, jsonObj.Northing]);

            })
            .on('done', (error) => {

                var featuresCollection = csv2json(MyData);

                console.log("from here:  ", featuresCollection);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(featuresCollection);
                // remove file
                // With a callback:
                fs.remove(filepath, err => {
                    if (err) return console.error(err)

                    console.log(filepath + ' removed successfully!')
                })
            })

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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


            //Formidable changes the name of the uploaded file
            //Rename the file to its original name
            fs.rename(file.path, './public/' + file.name, function(err) {
                if (err)
                    throw err;

                filepath = './public/' + file.name;
                console.log('<<< renamed complete sucessfully >>>');

            });

        });

        form.on('end', () => {

            res.json();
        });
        form.parse(req);

    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT OPERATION NOT SUPORTED HERE'); // Updating not allowed
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE OPERATION IS NOT SUPORTED ON THIS ROUTER OUTLET'); // Updating not allowed
    });


allFileUploadRouter.route('/:cvsFile/shapefile')
    .options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {

        var featuresCollection = [];

        ogr2ogr(filepath).exec(function(er, data) {
            if (er) console.error(er);
            data.name = 'content';
            console.log(JSON.stringify(data, null, ' '));
            featuresCollection.push(data.features[0].geometry);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(featuresCollection);

        });

        // remove file
        // With a callback:
        fs.remove(filepath, err => {
            if (err) return console.error(err)
            console.log(filepath + ' removed successfully!')
        })

    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
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

            //Formidable changes the name of the uploaded file
            //Rename the file to its original name
            fs.rename(file.path, './public/' + file.name, function(err) {
                if (err)
                    throw err;

                filepath = './public/' + file.name;
            });

        });

        form.on('end', () => {

            res.json();
        });
        form.parse(req);


    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT OPERATION NOT SUPORTED HERE'); // Updating not allowed
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE OPERATION IS NOT SUPORTED ON THIS ROUTER OUTLET'); // Updating not allowed
    });



module.exports = allFileUploadRouter;
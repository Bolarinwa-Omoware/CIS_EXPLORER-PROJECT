const express = require('express');
const bodyParser = require('body-parser');
const IncomingForm = require('formidable').IncomingForm;
const fs = require('fs-extra');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const GeoFeatures = require('../models/geoFeatures');
const ogr2ogr = require('ogr2ogr');

let filepath;

const feturesUploadRouter = express.Router();

feturesUploadRouter.use(bodyParser.json());

feturesUploadRouter.route('/')
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
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdminUser,
        (req, res, next) => {

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

                fs.remove(filepath, err => {
                    if (err) return console.error(err)

                    console.log(filepath + ' removed successfully!')
                });

                res.json();

            });
            form.parse(req);

            // console.log(`req.user.admin: ${req.user.admin}`);
            // Dishes.create(req.body)
            //     .then((dish) => {
            //         console.log('Dish Created ', dish);
            //         res.statusCode = 200;
            //         res.setHeader('Content-Type', 'application/json');
            //         res.json(dish);
            //     }, (err) => next(err))
            //     .catch((err) => next(err));
        })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdminUser,
        (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /dishes');
        })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdminUser,
        (req, res, next) => {
            //console.log(req.user.admin);
            // Dishes.remove({})
            //     .then((resp) => {
            //         res.statusCode = 200;
            //         res.setHeader('Content-Type', 'application/json');
            //         res.json(resp);
            //     }, (err) => next(err))
            //     .catch((err) => next(err));
        });

module.exports = feturesUploadRouter;
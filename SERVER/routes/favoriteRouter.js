var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

var Favorite = require('../models/favorites');
var Dish = require('../models/dishes');


var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, function(req, res, next) {
        Favorite.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .exec(function(err, favorites) {
                if (err) return err;
                res.json(favorites);
            });
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {

        Favorite.find({ 'user': req.user._id })
            .exec(function(err, favorites) {
                if (err) throw err;
                req.body.user = req.user._id;

                if (favorites.length) {

                    for (let j = 0; j < req.body.length; j++) {
                        let ind = favorites[0].dishes.indexOf(req.body[j]._id);
                        if (ind == -1) {
                            favorites[0].dishes.push(req.body[j]);
                        }
                    }

                    favorites[0].save(function(err, favorite) {
                        if (err) throw err;
                        console.log('Um somethings up!');
                        res.json(favorite);
                    });

                } else {

                    Favorite.create({ postedBy: req.body.postedBy }, function(err, favorite) {
                        if (err) throw err;

                        for (let i = 0; i < req.body.length; i++) {
                            favorite.dishes.push(req.body[i]);
                        }

                        favorite.save(function(err, favorite) {
                            if (err) throw err;
                            console.log('Something is up!');
                            res.json(favorite);
                        });
                    })
                }
            });
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .delete(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {
        Favorite.remove({ 'postedBy': req.user._doc._id }, function(err, resp) {
            if (err) throw err;
            res.json(resp);
        })
    });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ "exists": false, "favorites": favorites });
                } else {
                    if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": false, "favorites": favorites });
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": true, "favorites": favorites });
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id }, (err, favorite) => {
            if (err) return next(err);

            if (!favorite) {
                Favorite.create({ user: req.user._id })
                    .then((favorite) => {
                        favorite.dishes.push({ "_id": req.params.dishId });
                        favorite.save()
                            .then((favorite) => {
                                console.log('Favorite Created!');
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                return res.json(favorite);

                            })
                            .catch((err) => {
                                return next(err);
                            });
                    })
                    .catch((err) => {
                        return next(err);
                    })
            } else {
                if (favorite.dishes.indexOf(req.params.dishId) < 0) {
                    favorite.dishes.push({ "_id": req.params.dishId });
                    favorite.save()
                        .then((favorite) => {
                            console.log('Favorite Dish Added');
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            return res.json(favorite);

                        })
                        .catch((err) => {
                            return next(err);
                        });
                } else {
                    res.statusCode = 403;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Dish ' + req.params.dishId + ' already exist')
                }
            }
        });
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('PUT operation not supported on /favorites/' + req.params.dishId);
    })
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .delete(cors.corsWithOptions, authenticate.verifyUser, function(req, res, next) {
        Favorite.findOne({ user: req.user._id }, (err, favorite) => {
            if (err) return next(err);

            var index = favorite.dishes.indexOf(req.params.dishId);
            if (index >= 0) {
                favorite.dishes.splice(index, 1);
                favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                            .populate('user')
                            .populate('dishes')
                            .then((favorite) => {
                                console.log('Favorite Dish Deleted!', favorite);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            });

                    })
                    .catch((err) => {
                        return next(err);
                    });
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Dish ' + req.params._id + ' not in your favorite');
            }
        });

    });

module.exports = favoriteRouter;
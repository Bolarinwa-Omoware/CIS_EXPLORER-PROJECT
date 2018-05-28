const dxfparsing = require('dxf-parsing');
const dxf = dxfparsing.Parser;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var geoObjectSchema = new Schema({
    type: {
        type: String,
        default: 'Polygon'
    },

    coordinates: []
});



var featureSchema = new Schema({
    type: {
        type: String,
        default: 'Feature'
    },

    properties: {},

    geometry: geoObjectSchema

}, { timestamps: true });



var geoFeatureCollection = new Schema({
    type: {
        type: String,
        default: 'FeatureCollection'
    },
    name: {
        type: String,
        unique: true
    },
    features: [featureSchema]
}, {
    timestamps: true
});




let GeoFeatures = mongoose.model('GeoFeature', geoFeatureCollection);

module.exports = GeoFeatures;
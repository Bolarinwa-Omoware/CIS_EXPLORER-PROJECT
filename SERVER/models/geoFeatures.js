const dxfparsing = require('dxf-parsing');
const dxf = dxfparsing.Parser;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;


var geoProperties = new Schema({
    EXCESS_SQM: {
        type: String,
        required: false
    },
    LINC_ID: {
        type: String,
        required: false
    },
    STREET_NAM: {
        type: String,
        required: false
    },
    ESTATE: {
        type: String,
        required: false
    },
    DELIV_STAT: {
        type: String,
        required: false
    },
    REMARK: {
        type: String,
        required: false
    },
    BLOCK_ID: {
        type: String,
        required: false
    },
    EX_PLOT_NO: {
        type: String,
        required: false
    },
    PLOT_NO: {
        type: String,
        required: false
    },
    ORG_SIZE: {
        type: String,
        required: false
    },
    ADDRESS: {
        type: String,
        required: false
    },
    EX_SIZE: {
        type: String,
        required: false
    },
    RATE_PSqM: {
        type: Currency,
        required: false
    },
    AMT_PAYABL: {
        type: Currency,
        required: false
    },
    NOR_PREMIU: {
        type: Currency,
        required: false
    },
    CAP_CONB: {
        type: Currency,
        required: false
    },
    SCAP_CONB: {
        type: String,
        required: false
    },
    SURVEY_FEE: {
        type: Currency,
        required: false
    },
    SSURVEY_FE: {
        type: String,
        required: false
    },
    ADM_CHARGE: {
        type: Currency,
        required: false
    },
    RegConvFee: {
        type: Currency,
        required: false
    },
    SRegConvFe: {
        type: String,
        required: false
    },
    STAMP_DUTY: {
        type: Currency,
        required: false
    },
    ANN_GRent: {
        type: Currency,
        required: false
    },
    LandCharge: {
        type: Currency,
        required: false
    },
    SLandCharg: {
        type: String,
        required: false
    },
    DeliverySt: {
        type: Number,
        required: false
    },
    SurPlFilen: {
        type: String,
        required: false
    },
    DNFilename: {
        type: String,
        required: false
    }

})

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

    properties: geoProperties,

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
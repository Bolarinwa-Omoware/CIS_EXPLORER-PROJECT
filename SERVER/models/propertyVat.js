const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);

const Currency = mongoose.Types.Currency;



var geoSchema = new Schema({
    type: {
        type: String,
        required: true
    },

    coordinates: {
        type: Array,
        required: true
    }
});

var datumDefSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

var projSchema = new Schema({
    type: {
        type: String,
        required: true
    },

    properties: datumDefSchema
});



// var taxPaySchema = new Schema({
//     AMOUNT_DUE: {
//         type: Number,
//         default: 2000
//     },
//     AMOUNT_PAID: {
//         type: Number,
//         default: 0
//     },

// }, {
//     timestamps: true
// });

// taxPaySchema.virtual('AMOUNT_LEFT').get(function() {
//     return this.AMOUNT_DUE - this.AMOUNT_PAID;
// });

var propertySchema = new Schema({
    PPTY_USE: {
        type: String,
        required: false
    },
    PPTY_TYPE: {
        type: String,
        required: false
    },
    PPTY_ID: {
        type: String,
        required: true,
        unique: true
    },
    BUSINAME: {
        type: String,
        required: false
    },
    BUSITYPE: {
        type: String,
        required: false
    },
    BUSIPROD: {
        type: Number,
        required: false
    },
    PPTY_PLT_N: {
        type: String,
        required: false
    },
    PPTY_STRN: {
        type: String,
        required: false
    },
    PPTY_ADDY: {
        type: String,
        required: false
    },
    BUSIREG_ST: {
        type: String,
        required: false
    },
    BUSI_REGNO: {
        type: String,
        required: false
    },
    BUSI_INC_Y: {
        type: String,
        required: false
    },
    TAX_APPLI: {
        type: String,
        required: false
    },
    STAF_STR: {
        type: String,
        required: false
    },
    TIN_NO: {
        type: String,
        required: false
    },
    TIN_STATUS: {
        type: Boolean,
        required: false
    }
});

var featuresSchema = new Schema({
    type: {
        type: String,
        required: true
    },

    properties: {},

    geometry: [geoSchema]

});

var geoFeatureCollection = new Schema({
    type: {
        type: String,
        required: true
    },
    crs: {
        type: projSchema
    },
    features: [featuresSchema]
}, {
    timestamps: true
});

var layerCollection = new Schema({
    layer: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: geoFeatureCollection,
        required: true
    }
}, {
    timestamps: true
});


let PropertyVat = mongoose.model('TaxOnProperty', layerCollection);

module.exports = PropertyVat;
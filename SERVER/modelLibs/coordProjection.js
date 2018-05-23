const proj4 = require('proj4');

proj4.defs([
    [
        'EPSG:4326',
        '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
    ],
    [
        'EPSG:4269',
        '+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees'
    ],
    [
        'EPSG:26331', //Minna_UTM_Zone_31N
        "+proj=utm +zone=31 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs"
    ],
    [
        'EPSG:26332', //Minna_UTM_Zone_32N
        "+proj=utm +zone=32 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs"
    ],
    ['EPSG:2323', // Conony Zero
        "+proj=tmerc +lat_0=4 +lon_0=8.5 +k=0.99975 +x_0=670553.98 +y_0=0 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=us-ft +no_defs"
    ]
]);


/*
  Convertion from Minna_UTM_Zone_31N to Wgs 1984.
 */
const projMinna31_Wgs = (coordinates, type) => {
    const result = [];

    if (type === 'Polygon') {
        for (let i = 0; i < coordinates[0].length; i++) {
            result.push(proj4('EPSG:26331').inverse(coordinates[0][i]));
        }
    } else if (type === 'LineString' || type === 'Point' || type === 'dxfPolygon') {
        for (let i = 0; i < coordinates.length; i++) {
            result.push(proj4('EPSG:26331').inverse(coordinates[i]));
        }
    }

    return result;
}

/*
  Convertion from Minna_UTM_Zone_32N to Wgs 1984.
 */
const projMinna32_Wgs = (coordinates, type) => {
    const result = [];

    if (type === 'Polygon') {
        for (let i = 0; i < coordinates[0].length; i++) {
            result.push(proj4('EPSG:26332').inverse(coordinates[0][i]));
        }
    } else if (type === 'LineString' || type === 'Point') {
        for (let i = 0; i < coordinates.length; i++) {
            result.push(proj4('EPSG:26332').inverse(coordinates[i]));
        }
    }

    return result;
}

function selectProjType(projType) {
    return ((projType === 'EPSG:26332') ? projMinna32_Wgs : projMinna31_Wgs)
}

function projGeoJsonRequestBody(body, projFrom) {
    let numOfFeas = body.data.features.length;
    for (let j = 0; j < numOfFeas; j++) {
        let type = body.data.features[j].geometry.type;
        let coordinates = body.data.features[j].geometry.coordinates;

        if (projFrom === 'EPSG:26332') {
            body.data.features[j].geometry.coordinates = projMinna32_Wgs(coordinates, type);
        } else if (projFrom === 'EPSG:26331') {
            body.data.features[j].geometry.coordinates = projMinna31_Wgs(coordinates, type);
        }

    }
    return body;
}

function projFeatureRequestBody(body, projFrom) {
    let type = body.geometry.type;
    let coordinates = body.geometry.coordinates;

    if (projFrom === 'EPSG:26332') {
        body.geometry.coordinates = projMinna32_Wgs(coordinates, type);
    } else {
        body.geometry.coordinates = projMinna31_Wgs(coordinates, type);
    }
    return body;
}

module.exports = {
    "projMinna31_Wgs": projMinna31_Wgs,
    "projMinna32_Wgs": projMinna32_Wgs,
    "projGeoJsonRequestBody": projGeoJsonRequestBody,
    "projFeatureRequestBody": projFeatureRequestBody
}
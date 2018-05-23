geoJson = ()=> {
    return {
        "type": "FeatureCollection",
        "features": []
    }
};

toFeature = (type, coordinates, layer )=>{
    return {
        "type": "Feature",
        "properties": {
            "name": layer
        },
        "geometry": {
            "type": type,
            "coordinates": [coordinates]
        }
    }
}

module.exports = {
    "toFeature": toFeature,
    "geoJson": geoJson
}

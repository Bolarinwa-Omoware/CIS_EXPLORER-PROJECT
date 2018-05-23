export interface Coordinates {
    "type": String,
    "features": [{
        "geometry":{
            "coordinates":[{
                "0":[{}]
            }]
        }
    }]
}


export interface Coordinate{
    pb? : string,
    easting: Number,
    northing: Number
}

export interface GeoJson_Data{
    type: String,
    properties?: {},
    coordinates: {}
}

export interface CSVJson_Data{
    type?: String,
    properties?: {},
    coordinates: {},
    pb: {}
}

export interface TraverseData {

    beaconId: String[],
    distance: number[],
    bearing: number[],
    initControl_x: number,
    initControl_y: number,
    finalControl_x: number,
    finalControl_y: number,
    initControl_id: string,
    finalControl_id?: string
}
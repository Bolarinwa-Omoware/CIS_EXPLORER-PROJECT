declare let proj4:any;

export class ProjectionModel{
    constructor(){
        proj4.defs([
            [
                'EPSG:4326',
                '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
            [
                'EPSG:4269',
                '+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees'
            ],
            [
                'EPSG:26331',
                "+proj=utm +zone=31 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs"
            ],
            [
                'EPSG:26332',
                "+proj=utm +zone=32 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=m +no_defs"
            ],
            [  'EPSG:2323', // Conony Zero
                "+proj=tmerc +lat_0=4 +lon_0=8.5 +k=0.99975 +x_0=670553.98 +y_0=0 +ellps=clrk80 +towgs84=-92,-93,122,0,0,0,0 +units=us-ft +no_defs"
            ]
        ]);

       
    } 

    buildTest(){
        var firstProjection = 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
        var secondProjection = "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
        //I'm not going to redefine those two in latter examples.
        console.log(proj4('EPSG:2323', 'EPSG:26331', [340344.73,906664.83]));
        // [-2690666.2977344505, 3662659.885459918]

    }

    public transformArray2_Minna31(data){
        const result = [];
        data.forEach(item=>{
            result.push(proj4('EPSG:26331').inverse(item));
        });
        return result;
    }

    /**
     * TRANSFORMING ARRAY OF DATA TO SPECIFY PROJECTION
     * @param datums 
     * @param status 
     * @param data 
     */
    public transformProj(datums, status, data) {
        const result = [];
        // check if datums input are of two PARAMETER
        if (datums.length === 2) {
            if (status) { // if status === forward
                data.forEach(item => {
                    result.push(proj4(datums[0], datums[1]).forward(item));
                });
            } else { // if status === inverse
                data.forEach(item => {
                    result.push(proj4(datums[0], datums[1]).inverse(item));
                });
            }
        } else if (datums.length === 1) {
            if (status) { // if status === forward
                data.forEach(item => {
                    result.push(proj4(datums[0]).forward(item));
                });
            } else { // if status === inverse
                data.forEach(item => {
                    result.push(proj4(datums[0]).inverse(item));
                });
            }
        } else {
            console.log("Wrong Transformation PARAMETER");
        }
        return result;
    }


}
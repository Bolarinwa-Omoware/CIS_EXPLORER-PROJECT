function csv2json(data) {
    const pb = [];
    const coordinates = []
    data.forEach(dat => {
        pb.push(dat[0]);
        const xy = [Number(dat[1]), Number(dat[2])];
        coordinates.push(xy);
    });

    return {
        "pb": pb,
        "coordinates": [coordinates]
    }
}

module.exports = {
    "csv2json": csv2json
}
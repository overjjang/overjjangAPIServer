const fs = require('fs');
const csv = require('csv-parser');
const path = require("node:path");

function getDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function sendHospitalData(patientName, latitude, longitude, imergency) {
    return new Promise((resolve, reject) => {
        const hospitals = [];
        fs.createReadStream(path.join(__dirname, '/public/assets/hospitalData.csv'), { encoding: 'utf-8' })
            .pipe(csv())
            .on('data', (row) => {
                hospitals.push(row);
            })
            .on('end', () => {
                const filtered = hospitals
                    .filter(hospital =>
                        hospital['의료기관 분류'] !== '한의원' &&
                        hospital['의료기관 분류'] !== '치과의원'
                    )
                    .map(hospital => {
                        const lat = parseFloat(hospital.Latitude?.trim());
                        const lon = parseFloat(hospital.Longitude?.trim());
                        return {
                            ...hospital,
                            distance: getDistance(latitude, longitude, lat, lon)
                        };
                    })
                    .filter(hospital => !isNaN(hospital.distance));

                const nearest5 = filtered
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 5);

                resolve(nearest5);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

module.exports = { sendHospitalData };
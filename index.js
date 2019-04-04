var request = require('request');
const uuidv1 = require('uuid/v1');
var Thread = require('async-threading');
const fs = require('fs');

const config = require('./telemetry.json');

const hostString = `https://${config.host}`;

const telemStartTimeMilis = Date.now();
const telemStartTime = new Date();

var uuid = null;
try {
    uuid = fs.readFileSync('./uuid.txt');
} catch (e) {
    uuid = null;
}
if (!uuid) {
    uuid = uuidv1();
    try {
        fs.writeFileSync('./uuid.txt', uuid);
    } catch (e) {
        uuid = 'ERROR! - Device failed to save uuid!';
    }
}



var telemetryThread = new Thread(
    () => {
        request.post(
            {
                url : hostString + '/deposit',
                form : {
                    uuid : uuid,
                    version : '1.0',
                    uptime : ((Date.now()) - telemStartTimeMilis),
                    upSince : telemStartTime
                }
            },
            function (error, response, body) {
                console.log(body);
                if (!error && response.statusCode == 200) {
                    console.log('');
                } else {
                    console.log('Error sending telemetry! Please contact <iainmoncrief@gmail.com>');
                }
            }
        );
    },
    1000 * 60 * 60 * 4,
    //100,
    true
);

module.exports = telemetryThread;
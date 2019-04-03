var request = require('request');
const uuidv3 = require('uuid/v3');
var Thread = require('async-threading');

const config = require('./telemetry.json');

const hostString = `https://${config.host}` ;

var telemetryThread = new Thread(
    () => {
        request.post(
            {
                url : hostString + '/deposit',
                form : {
                    uuid : uuidv3('arbitrary-register.grape-juice.org', uuidv3.DNS),
                    version : '1.0'
                }
            },
            function (error, response, body) {
                console.log(body);
                if (!error && response.statusCode == 200) {
                    console.log('')
                } else {
                    console.log('Error sending telemetry! Please contact <iainmoncrief@gmail.com>');
                }
            }
        );
    },
    1000 * 60 * 60 * 4,
    true
);

module.exports = telemetryThread;
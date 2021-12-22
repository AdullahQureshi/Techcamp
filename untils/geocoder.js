const NodeGeocoder = require('node-geocoder');

const options = {
    // provider= process.env.GEOCODER_PROVIDER,
    provider:'mapquest',
    httpAdaptar:'https',
    apiKey : "u0LW4rUGc3bnkRsHmbmzkAdSkHY44E2p",
    formatter: null

};

const geocoder = NodeGeocoder(options)

module.exports = geocoder
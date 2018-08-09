const request = require('request');

const options = {  
    url: 'https://www.cradlepointecm.com/api/v2/routers/',
    method: 'GET',
    headers: {
        'X-CP-API-ID': '…',
        'X-CP-API-KEY': '…',
        'X-ECM-API-ID': '…',
        'X-ECM-API-KEY': '…',
        'Content-Type': 'application/json'
    }
};

request(options, function(err, res, body) {  
    let json = JSON.parse(body);
    console.log(json);
});
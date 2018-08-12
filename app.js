const request = require('request'),
    fs = require('fs'),
    options = {
        url: 'https://www.cradlepointecm.com/api/v2/routers/?limit=500',
        method: 'GET',
        headers: {
            'X-CP-API-ID': '...',
            'X-CP-API-KEY': '...',
            'X-ECM-API-ID': '...',
            'X-ECM-API-KEY': '...',
            'Content-Type': 'application/json'
        }
    };

const runTimer = setInterval(function () {

    fs.stat("LTEData.csv", function (err, data) {
        if (!err) {
            fs.unlink("LTEData.csv", function (data) {});
        }
    });

    request(options, function (err, res, body) {
        if (err) {
            console.log(err);
        } else {
            procResult(body);
        }
    });
}, 300000);

function procResult(data) {
    let jsonData = JSON.parse(data);
    let lteData = jsonData.data;

    for (let i = 0; i < lteData.length; i++) {
        let name = lteData[i].name;
        let status = lteData[i].state;
        let ipArr = [];

        if (lteData[i].ipv4_address != null) {
            ipArr = lteData[i].ipv4_address.split(".", 4);
        }
        //CradlePointCollection[i] = new Cradlepoint(nameParser(name), status, conType(ipArr[0]));
        csvWriter(nameParser(name) + "," + status + "," + conType(ipArr[0]) + "\n")
    }

    function nameParser(data) {
        let data2 = data.replace(/\D/g, '');
        let data3 = data2.replace(/^0+/g, '');
        if (data3.length === 1) {
            return "00" + data3;
        } else if (data3.length === 2) {
            return "0" + data3;
        } else {
            return data3;
        }
    }

    function conType(data) {
        if (data == "166") {
            return "LTE";
        } else {
            return "WAN";
        }
    }

    function csvWriter(data) {
        fs.appendFile('LTEData.csv', data, 'utf8', function (err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
                // Success
            }
        });
    }

    runTimer.start();
}

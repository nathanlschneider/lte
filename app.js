const os = require('os'),
    request = require('request'),
    express = require('express'),
    app = express();

let CradlePointCollection = [];

app.get("/?WSDL", function (req, res) {
    res.send("ok!");
});

app.get("/post", function (req, res) {
    res.send("ok!");
});

app.listen(3000, function () {
    console.log("Sever started on " + os.hostname() + " on port 3000. ");
});

const options = {
    url: 'https://www.cradlepointecm.com/api/v2/routers/?limit=500',
    method: 'GET',
    headers: {
        'X-CP-API-ID': 'e79c6722',
        'X-CP-API-KEY': '11248c51069c2e200d1e89c74830c431',
        'X-ECM-API-ID': 'a86d9b3c-6f1b-498d-907a-bd2facf56bc9',
        'X-ECM-API-KEY': '5d707dd2d354f0cc125cb43e7b365b972f7454c2',
        'Content-Type': 'application/json'
    }
};

request(options, function (err, res, body) {
    if (err) {
        console.log(err);
    } else {
        procResult(body);
    }
});

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
        CradlePointCollection[i] = new Cradlepoint(nameParser(name), status, conType(ipArr[0]));
    }

    for (let i = 0; i < CradlePointCollection.length; i++) {
        if (CradlePointCollection[i].id == "023") {
            console.log(CradlePointCollection[i]);
        }
    }

    function Cradlepoint(id, status, connectionType) {
        this.id = id;
        this.status = status;
        this.connection = connectionType;
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
}
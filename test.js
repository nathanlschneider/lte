const fs = require('fs');

fs.stat("LTEData.csv", function(err, data){
    if (!err) {
        fs.unlink("LTEData.csv", function (data) {
        });
    }
});
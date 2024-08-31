var User = require('../models/Product')
var csv = require('csvtojson')

const importUser = async(req, res) => {
    try {
        console.log("TRY USER CONTROLLER");

        csv()
        .fromFile(req.file.path)
        .then((res) => {
            console.log(res);
        })

        res.send({status:200, success:true, msg:'running'});
    }
    catch (error) {
        res.send({status:400, success:false, msg:error.message});
    }
}

module.exports = importUser
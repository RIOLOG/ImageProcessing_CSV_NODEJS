const { parseCSV } = require('../utils/csvHandler');
const { processImagesAsync } = require('../workers/imageWorker');
const Request = require('../models/Request');
const Product = require('../models/Product');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');


const upload = multer({ dest: 'uploads/' });
const uploadCSVFile = upload.single('csvFile');


async function uploadCSV(req, res) {
    console.log("image Service 1")

    try {
        const csvFilePath = req.file.path;
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        const parsedData = await parseCSV(csvData);
        console.log("image Service 2", parsedData);

        if (parsedData.length === 0) {
            console.log("image Service 3");
            return res.status(400).json({ error: 'No valid data found in CSV file' });
        }

        const requestId = crypto.randomBytes(16).toString('hex');
        const products = parsedData.map(({ serialNumber, productName, inputImageUrls }) => {
            console.log("image Service 4", ({ serialNumber, productName, inputImageUrls, requestId }));
            return new Product({ serialNumber, productName, inputImageUrls, requestId });
        });

        await Product.insertMany(products);

        const request = new Request({ requestId, status: 'pending' });
        await request.save();

        processImagesAsync(requestId, parsedData);

        fs.unlinkSync(csvFilePath);

        res.json({ requestId });
    } 
    catch (err) {
        console.error('Error processing CSV upload:', err.message);
        res.status(400).json({ error: err.message });
    }
}

async function checkStatus(req, res) {
    const { requestId } = req.params;
    const request = await Request.findOne({ requestId });

    if (!request) return res.status(404).json({ error: 'Request not found' });

    res.json({ status: request.status });
}

module.exports = { uploadCSV, uploadCSVFile, checkStatus };

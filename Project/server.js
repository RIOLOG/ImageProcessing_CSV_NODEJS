const express = require('express');
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const imageRoutes = require('./controllers/imageController'); 
const userRoute = require('./routes/userRoute.js');


dotenv.config();

connectDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', imageRoutes);
app.use('/test', userRoute);


app.get("/", (req, res) => {
    res.status(200).send("Ankit Singh");
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`API RUNNING on port ${PORT}`.bgMagenta);
});

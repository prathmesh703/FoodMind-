const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authroutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => console.log("mongo db connected")).catch((err)=>console.error(err));

app.route("/api/auth", authroutes);

app.listen(5000, ()=> console.log('server runnig on port 5000'));
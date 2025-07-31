const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();


app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT ;

connectDB();
app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
})

app.get('/', (req,res)=>{
    res.send('hello from backend');
})


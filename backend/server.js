const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
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

app.use('/api/auth', authRoutes);


app.get('/', (req,res)=>{
    res.send('hello from backend');
})


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');


app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const User = require('./models/User');

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }
})

io.on('connection', (socket) =>{
    console.log('a user connected', socket.id);

    socket.on('register' , async(userId) =>{
        await User.findByIdAndUpdate(userId , { socketId: socket.id }, { new: true });
        console.log(`User with ID ${userId} registered with socket ID ${socket.id}`);
    })
    
    socket.on('disconnect', async() => {
        console.log('user disconnected', socket.id);
        await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
        console.log(`User with socket ID ${socket.id} disconnected`);
    });

    socket.on('send alert', (alert) => {
        io.emit('new alert', alert);
    });
})
app.set('io', io);


const port = process.env.PORT ;

connectDB();
app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
})

app.use('/api/auth', authRoutes);
app.use('/api/alert', alertRoutes);



app.get('/', (req,res)=>{
    res.send('hello from backend');
})

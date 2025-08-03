const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const alertRoutes = require('./routes/alertRoutes');

require('dotenv').config();


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
const connectedUsers  = new Map();

io.on('connection', (socket) =>{
    console.log('a user connected', socket.id);

    socket.on('registerSocket' , async(userId) =>{
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
app.set('connectedUsers', connectedUsers);


const port = process.env.PORT ;

connectDB();

server.listen(process.env.PORT, () => {
  console.log(`Server with Socket.IO running on port ${process.env.PORT}`);
});

app.use('/api/auth', authRoutes);
app.use('/api/alert', alertRoutes);



app.get('/', (req,res)=>{
    res.send('hello from backend');
})

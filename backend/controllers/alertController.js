const User = require('../models/User');
const Alert = require('../models/Alert');

exports.createAlert = async ( req , res ) =>{
    const { alertType , description, cordinates } = req.body;
    
    if(!cordinates || cordinates.length !== 2){
        return res.status(400).json({
            message: 'Coordinates are required'
        });
    }

    try {
        const newAlert = new Alert({
            userId: req.user._id,
            alertType,
            description,
            cordinates,
            location:{
                type : 'point',
                coordinates: cordinates
            }
        })
        await newAlert.save();
        io.emit('new alert' , newAlert); 

        const nearbyUser = await User.find({
            location:{
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: cordinates
                    }
                },
                $maxDistance: 5000 
            }
        })

        nearbyUser.forEach( user => {
            if( user.socketId ){
                io.to(user.socketId).emit(' New Alert Notification', newAlert);
            }
        })

        return res.status(201).json({
            message: ' Alert created/Sent successfully',
            alert: newAlert
        })


    } catch (error) {
        console.error('error creating alert ', error);
        res.status(500).json({
            message: "Internal server error"
        })
        
    }

}

exports.getAlerts = async (req , res) =>{
    try {
        const alerts = await Alert.find().populate('userId', 'username email');
        return res.status(200).json({
            message: 'Alerts fetched successfully',
            alerts
        });
        
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
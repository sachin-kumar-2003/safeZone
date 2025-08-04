const User = require('../models/User');
const Alert = require('../models/Alert');

exports.createAlert = async ( req , res ) =>{
    const io = req.app.get('io');
    const { alertType , description, cordinates } = req.body;
    console.log(alertType, description, cordinates);
    
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
                type : 'Point',
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
                    },
                    $maxDistance: 5000 
                },
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


exports.deleteAlert = async (req, res) => {
  const alertId = req.params.id; 
  console.log('Deleting alert with ID:', alertId);
  try {
    const alert = await Alert.findByIdAndDelete(alertId);
    if (!alert) {
      return res.status(404).json({
        message: 'Alert not found'
      });
    }
    return res.status(200).json({
      message: 'Alert deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};


exports.updateAlert = async ( req , res ) =>{
    const  alertId   = req.params.id;
    const { alertType, description, cordinates } = req.body;
    try {
        const alert = await Alert.findById(alertId);
        if(!alert) {
            return res.status(404).json({
                message: 'Alert not found'
            });
        }

        if(cordinates && cordinates.length === 2) {
            alert.cordinates = cordinates;
            alert.location = {
                type: 'Point',
                coordinates: cordinates
            };
        }

        if(alertType) {
            alert.alertType = alertType;
        }

        if(description) {
            alert.description = description;
        }

        await alert.save();

        return res.status(200).json({
            message: 'Alert updated successfully',
            alert
        });
        
    } catch (error) {
        console.error('Error updating alert:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
        
    }
}

exports.getAlertById = async (req, res) => {
    console.log("enter get alert by id");
    const  alertId  = req.params.id;
    console.log('Fetching alert with ID:', alertId);
    try {
        const alert = await Alert.findById(alertId).populate('userId', 'username email');
        if(!alert) {
            return res.status(404).json({
                message: 'Alert not found'
            });
        }
        return res.status(200).json({
            message: 'Alert fetched successfully',
            alert
        });
        
    } catch (error) {
        console.error('Error fetching alert:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}

exports.getUserAlerts = async (req, res) => {
    console.log(req.user._id);
    try {
        const userId = req.user._id;
        const alerts = await Alert.find({ userId }).populate('userId', 'username email');
        return res.status(200).json({
            message: 'All alerts fetched successfully',
            alerts
        });
    } catch (error) {
        console.error('Error fetching all alerts:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
        
    }
}

exports.getAllAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().populate('userId', 'username email');
        return res.status(200).json({
            message: 'All alerts fetched successfully',
            alerts
        });
    } catch (error) {
        console.error('Error fetching all alerts:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}
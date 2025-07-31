const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.protect = async ( req , res , next ) =>{
    const token = req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({
            message : "unauthorized person"
        })
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-passwordHash');
        if(!req.user){
            return res.status(404).json({
                message: "user not found"
            });
        }
        next();        
    } catch (error) {
        console.error('error during authentication ',error);
        return res.status(500).json({
            message: "internal server error"
        })
    }
}
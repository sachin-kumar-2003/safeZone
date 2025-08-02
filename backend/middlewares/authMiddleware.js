const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.protect = async ( req , res , next ) =>{
    let token = req.headers.authorization?.split(' ')[1];
    token = token.toString();
    console.log('Token:', token);
    if(!token){
        return res.status(401).json({
            message : "unauthorized person"
        })
    }
    try {
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = await User.findById(decoded.id).select('-passwordHash');
        console.log('User from token:', req.user);
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
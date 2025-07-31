const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async ( req , res ) =>{
    const {username , email , password} = req.body;
    try {
        const existUser = await User.find({email});
        if(existUser){
            return res.status(400).json(
                {
                    message : "user already exists"
                }
            )
        }
        const passwordHash = await bcrypt.hash(password , 10);
        const newUser = new User.create({
            username,
            email,
            passwordHash
        });

        const token = jwt.sign(
            {userId : newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        return res.status(201).json({
            message: 'user registered successfull'
        })
        
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

exports.login = async ( req , res ) =>{
    const {email , password } = req.body;
    try{
        const user = await User.find({email});
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        const isMatch = await bcrypt.compare( password , user.passwordHash );
        if(!isMatch){
            return res.status(400).json({
                message: "invalid credentials"
            })
        }
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );
        return res.status(200).json({
            message: 'login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                trustScore: user.trustScore
            }
        });

    }catch(error){
        console.error('Error during login:', error);
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}
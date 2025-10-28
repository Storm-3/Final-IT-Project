const bcrypt = require('bcrypt');
const {Users} = require('../models');
const jwt = require('jsonwebtoken')
require('dotenv').config();

exports.ChangePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect Current Password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedNewPassword });

        return res.status(200).json({ message: 'Password Updated Successfully.' });
    } catch (error) {
        console.error('Password update error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.RegisterUser = async (req,res) =>{
    try{
        const {email, password} = req.body;
        //checking if necessary fileds are filled.
        if ( !email || !password){
            return res.status(400).json({message: "All fields are required."});
        }
        //checking if user already exists
        const existingUser = await Users.findOne({where: {email} })
        if (existingUser){
            return res.status(409).json({message: "User already exists."})
        }

        //Encrypting the password (hash)
        const hashedPassword = await bcrypt.hash(password, 10);

        //creating the user
        const newUser = await Users.create({
            email,
            password: hashedPassword
        });
            const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            res.status(201).json({
            message: "User registered successfully",
            userId: newUser.id,
            token
        });
    }
    catch(error){
        console.error("Registration error:", error);
        res.status(500).json({message: "Internal Server error."});
    }
};

exports.LoginUser = async (req,res) =>{
    try{
        const {email, password} = req.body;
        //Checking if user has filled necessary fields
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required."})
        }
        //find user by email
        const user = await Users.findOne({where: {email}});
        if (!user){
            return res.status(404).json({message: "User Not Found."})
        }

        //compare password
        const doesPassMatch = await bcrypt.compare(password, user.password);
        if (!doesPassMatch){
            return res.status(401).json({message: "Incorrect Email or Password."})
        }
        const token = jwt.sign(
            {   
                userId: user.id,
                roleId: user.role_id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN || '1hr'}
        )

        //success
        return res.status(200).json({message: "User logged in successfully.", userId: user.id, token});

       
    }
    catch(error){
        console.error("Login Error:", error);
        res.status(500).json({message: "Internal Server Error."})
    }
}

exports.VerifyEmail = async (req, res) =>{
    try{
        const {token} = req.query;
        if(!token)
            return res.status(400).json({error: 'Verfication token is required.'});

        const user = await db.Users.findOne({where: {verificationToken: token}});
        if(!user)
            return res.status(400).json({error: 'Invalid or expired token.'})

        user.isEmailVerified = true;
        user.status = 'active';
        user.verificationToken = null;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
    } catch(err){
         res.status(500).json({ error: 'Email verification failed', details: err.message });
    }
}
//things to consider adding 03/09/25
//needed: jwt token generation - login
//needed: forgot password
// logout - stateless jwt vs stateful?
//refresh token
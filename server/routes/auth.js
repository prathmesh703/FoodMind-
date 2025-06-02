const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/signup', async (req,res) =>{
    const  {name, email,password }= req.body;

    try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async(req,res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            console.log("user not exist");
            return res.status(400).json({msg: 'user does not exist'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            console.log("invalid credentials");
            return res.status(400).json({msg: "invalid credentials"});
        }
        console.log("login successful");
        const token = jwt.sign({userId: user._id}, JWT_SECRET,{ expiresIn: '1d'});
        res.json({token});
    }catch (err){
        res.status(500).json({error: err.message });
    }
});

module.exports = router;
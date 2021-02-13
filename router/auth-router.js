const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');

router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
})
router.post('/register', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const existUser = await User.findOne({email});

    if(existUser) return res.status(400).json("This email already exist!");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        dob: dob
    })
    try{
        const savedUser = await newUser.save();
        res.status(200).json(savedUser); 
    }catch(err){
        res.status(400).send(err);
    }
})
module.exports = router;
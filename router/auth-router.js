const router = require('express').Router();
const User = require('../model/user');

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
    const newUser = new User({
        email: email,
        password: password,
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
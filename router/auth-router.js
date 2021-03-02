const router = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    try{
        const existUser = await User.findOne({email});

        if(existUser) return res.status(400).send("This email already exist!");
        if(password.length < 8) return res.status(400).send('Your password must more than 8 length');
        if(email.length < 8) return res.status(400).send('Your email must more than 8 length');
        if(!firstName || !lastName || !gender) return res.send('Please insert your name or lastname or gender');
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
            await newUser.save();
            res.sendStatus(200)
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).send('Invalid Email');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword) return res.status(400).send('Invalid Password');
    const token = jwt.sign({_id: user._id}, process.env.SECRET_TOKEN);
    res.cookie('auth-token',token,{httpOnly: true}).sendStatus(200);
})
module.exports = router;
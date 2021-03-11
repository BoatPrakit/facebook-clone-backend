const router = require('express').Router();
const User = require('../model/User');


router.get('/', async (req,res) => {
    const firstName = req.query.firstName;
    let lastName = req.query.lastName;
    if(!lastName) lastName = '.'
    const regexFirstName = new RegExp(`^${firstName}(\w*)?`);
    const regexLastName = new RegExp(`^${lastName}(\w*)?`);
     await User.find({ 
         firstName: { $regex: regexFirstName, $options: 'gi'},
         lastName: { $regex: regexLastName, $options: "gi"}
        })
     .select("firstName lastName _id email")
    .exec((err, matchUser) => {
        if(err) console.log(err)
        res.json(matchUser);
    })
})

module.exports = router;
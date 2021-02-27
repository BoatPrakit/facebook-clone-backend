const router = require('express').Router();
const RelationShip = require('../model/Relationship');
const User = require("../model/user");

router.post('/add/pending',async (req,res) => {
    try{
        const ownerRelation = await User.findOne({_id: req.body.ownerId});
        const requestUser = await User.findOne({_id: req.body.requestId});
        const relation = await RelationShip.findOne({ownerRelation: req.body.ownerId});
        if(!relation){
            const newRelationShip = new RelationShip({
                ownerRelation: ownerRelation._id,
                pending: [
                    { userId: requestUser._id, }
                ]
            })
            await newRelationShip.save(err => {
                if(err) console.log(err);
            });
            res.json({
                ownerRelation,
                requestUser,
                newRelationShip
            });
        }else{
            RelationShip.findOneAndUpdate({ownerRelation: req.body.ownerId},
                {
                $push: {
                    pending: { userId: req.body.requestId }
                }
            },{upsert: true}).exec();
            res.json(relation)
        }
    }catch(err){
        console.log(err);
    }
})
router.get('/', async (req,res) => {
    const relation = RelationShip.find();
    res.json(relation);
    // await RelationShip.findOne({_id: '6039351716e20e646c5c01ce'})
    // .populate('User','firstName lastName')
    // .exec((err,user) => {
    //     if(err) console.log(err)
    //     res.json(user);
    // })
})
router.post('/create', async (req,res) => {
    const user = await User.findOne({email: "myemail@email.com"});
    const relation = new RelationShip({
        User: user._id,
    })
    await relation.save(err => {
        if(err) console.log(err);
    });
    res.json(relation);
})
module.exports = router;
const router = require('express').Router();
const RelationShip = require('../model/Relationship');
const User = require("../model/User");

router.post('/pending/add',async (req,res) => {
    const ownerId = res.locals.user;
    try{
        const requestUser = await User.findOne({_id: req.body.requestId});
        const relation = await RelationShip.findOne({ownerRelation: ownerId});
        if(!relation){
            const newRelationShip = new RelationShip({
                ownerRelation: ownerId,
                pending: [
                    { userId: requestUser._id, }
                ]
            })
            await newRelationShip.save(err => {
                if(err) console.log(err);
            });
            res.sendStatus(200);
        }else{
            await RelationShip.findOneAndUpdate({ownerRelation: ownerId},
                {
                $push: {
                    pending: { userId: req.body.requestId }
                }
            },{upsert: true}).exec();
            res.sendStatus(200);
        }
    }catch(err){
        res.status(400).send("Invalid User")
    }
})
router.patch('/friend/add', async (req,res) => {
    try{
        const userId = res.locals.user;
        const anotherUser = await User.findOne({_id: req.body.requestId});
        await RelationShip.findOneAndUpdate({ownerRelation: userId},
            {
                $pull: { pending: {userId: anotherUser._id}}
            }, { multi: true }).exec();
        await RelationShip.findOneAndUpdate({ownerRelation: userId},
            {
                $push: { friends: { userId: anotherUser._id } }
            },{ upsert: true }).exec();
        const anotherUserRelation = await RelationShip.findOne({ownerRelation: anotherUser._id});
        if(!anotherUserRelation){
            const newRelationShip = new RelationShip({
                ownerRelation: anotherUser._id,
                friends: [ { userId: userId } ]
            })
            await newRelationShip.save(err => {
                if(err) console.log(err);
            });
        }else{
            await RelationShip.findOneAndUpdate({ownerRelation: userId},
                {
                $push: {
                    friends: { userId: userId }
                }
            },{upsert: true}).exec();
        }
        res.sendStatus(200);
    }catch(err){
        res.status(400).send("Invalid User")
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
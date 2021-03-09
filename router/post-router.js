const router = require('express').Router();
const Post = require('../model/Post');
const AllPost = require('../model/AllPost');

router.get('/mypost', async (req,res) => {
    const ownerId = res.locals.user;
    try{
        await AllPost.findOne({postBy: ownerId})
                        .populate('allPost.postId',)
                        .exec((err,myPost) => {
                        res.json(myPost); 
                        })
    }catch(err){
        console.log(err)
    }
});

router.post('/add', async (req,res) => {
    const ownerId = res.locals.user;
    const { description } = req.body; 
    try{
        const myPost = new Post({
            description 
        })
        await myPost.save();
        const myAllPost = await AllPost.findOne({postBy: ownerId});
        if(!myAllPost){
            const newAllPost = new AllPost({
                postBy: ownerId,
                allPost: [{ postId: myPost._id }]
            });
            await newAllPost.save();
        }else{
            await AllPost.findOneAndUpdate({postBy: ownerId},{
                $push: { allPost: { postId: myPost._id } },
            },{ upsert: true }).exec();
        }
        res.sendStatus(200);
    }catch(err){
        console.log(err)
    }
});

router.patch('/edit/:id', async (req,res) => {
    const { id } = req.params;
    const { description } = req.body;
    try{
        const post = await Post.findOneAndUpdate({_id: id},{
            isEdited: true,
            editedOn: new Date().getTime(),
            description 
        })
        if(post) res.sendStatus(200);
        else res.sendStatus(400);
    }catch(err){
        console.log(err)
    }
});

router.delete('/delete/:id', async (req,res) => {
    const { id } = req.params;
    const ownerId = res.locals.user;
    try{
        await Post.findOneAndDelete({_id: id});
        await AllPost.findOneAndUpdate({postBy: ownerId},{
            $pull: {allPost: {postId: id}}
        },{multi: true}).exec();
        res.sendStatus(200)
    }catch(err){
        console.log(err)
    }

})

router.get('/all/:id', async (req,res) => {
    const { id } = req.params;
    try{
        const a = await AllPost.findOne({postBy: id})
        .populate('allPost.postId')
        .exec();
        res.json(a)
    }catch(err){
        console.log(err)
    }
})


module.exports = router;
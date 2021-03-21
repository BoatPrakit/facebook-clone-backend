const router = require('express').Router();
const Post = require('../model/Post');
const AllPost = require('../model/AllPost');
const User = require('../model/User');

router.get('/mypost', async (req,res) => {
    const ownerId = res.locals.user;
    try{
        await AllPost.findOne({postBy: ownerId})
                        .populate({
                            path: 'allPost',
                            populate: {
                                path: 'postId',
                                model: 'Post',
                                // populate: {
                                //     path: 'comments',
                                //     populate: {
                                //         path: 'userId',
                                //         model: 'User',
                                //         select: 'firstName'
                                //     }
                                // },
                                populate: {
                                    path: 'likes comments',
                                    populate: {
                                        path: 'userId',
                                        model: 'User',
                                        select: 'firstName lastName'
                                    }
                                }
                            }
                        })
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
        const allPost = await AllPost.findOne({postBy: id})
        .populate('allPost.postId')
        .exec();
        res.json(allPost)
    }catch(err){
        console.log(err)
    }
})

router.post('/like/add', async (req,res) => {
    const userWhoPressLike = res.locals.user;
    const { postId } = req.body;
    await Post.findOneAndUpdate({
        _id: postId
    },{
        $push: { likes: {userId: userWhoPressLike} }
    }).exec((err, doc) => res.sendStatus(200));
})

router.post('/like/remove', async (req,res) => {
    const userWhoUnLike = res.locals.user;
    const { postId } = req.body;
    await Post.findOneAndUpdate({
        _id: postId
    },{
        $pull: { likes: {userId: userWhoUnLike} }
    },{multi: true}).exec((err, doc) => res.sendStatus(200));
})

router.post('/comment/add', async (req,res) => {
    const userWhoComment = res.locals.user;
    const { postId,detail } = req.body;
    await Post.findOneAndUpdate({
        _id: postId
    },{
        $push: { comments: {
            userId: userWhoComment,
            detail: detail
        } }
    }).exec((err, doc) => res.sendStatus(200));
})

router.post('/comment/remove', async (req,res) => {
    const { postId,targetCommentId } = req.body;
    await Post.findOneAndUpdate({
        _id: postId,
    },{
        $pull: { comments: {_id: targetCommentId} }
    }).exec((err, doc) => res.sendStatus(200));
})
module.exports = router;
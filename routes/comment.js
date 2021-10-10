const express=require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const { isLoggedIn, checkCommentOwnerShip } = require('../config/auth');

// add the comments to a post, here postid is passing in route
router.post('/:id/addcomment',isLoggedIn, async (req,res)=>{
    try {
        const newComment = new Comment({
            date:Date.now(),
            message:req.body.comment,
            author:{id:req.user.id,username:req.user.username},
            postId:req.params.id
        });
        await newComment.save();
        res.redirect('/profile');
    } catch (error) {
        return res.status(400).send({error:error});
    }
});

//showing the post with all their comments
router.get('/:id/show',async(req,res) => {
    try {
        const tid=undefined;
        const comments=await Comment.find({postId:req.params.id});
        const post=await Post.findById({_id:req.params.id});
        res.render('show',{tid,user:req.user,post,comments});
    } catch (error) {
        return res.status(400).send({error:error});
    }
})

// edit the comment, here comment id is passing in route
router.get('/comment/:id/edit',isLoggedIn,checkCommentOwnerShip,async(req,res) => {
    try {
        const id=req.params.id;
        const calledComment= await Comment.findById({_id:req.params.id});
        const comments=await Comment.find({postId:calledComment.postId});
        const post=await Post.findById({_id:calledComment.postId});
        res.render('show',{id,post,comments});
    } catch (error) {
        return res.status(400).send({error:error});
    }
})

// save the edited comment, here comment id is passing in route
router.post('/comment/:id/edit',isLoggedIn,checkCommentOwnerShip,async(req,res) => {
    try {
        const id=req.params.id;
        const tid=undefined;
        const calledComment= await Comment.findById({_id:req.params.id});
        await Comment.findByIdAndUpdate({_id:req.params.id},{
            message:req.body.editedComment
        });
        const comments=await Comment.find({postId:calledComment.postId});
        const post=await Post.findById({_id:calledComment.postId});
        res.render('show',{tid,post,comments});
    } catch (error) {
        return res.status(400).send({error:error});
    }
})

// delete the comment, here comment id is passing in route
router.get('/comment/:id/delete',async(req,res) => {
    try {
        const id=req.params.id;
        const tid=undefined;
        const calledComment= await Comment.findById({_id:req.params.id});
        const comments=await Comment.find({postId:calledComment.postId});
        const post=await Post.findById({_id:calledComment.postId});
        res.render('show',{tid,post,comments});
    } catch (error) {
        return res.status(400).send({error:error});
    }
})

// delete the comment, here comment id is passing in route
router.post('/comment/:id/delete',isLoggedIn,checkCommentOwnerShip,async(req,res) => {
    try {
        const id=req.params.id;
        const tid=undefined;
        const calledComment= await Comment.findById({_id:req.params.id});
        await Comment.findByIdAndDelete({_id:req.params.id});
        const comments=await Comment.find({postId:calledComment.postId});
        const post=await Post.findById({_id:calledComment.postId});
        res.render('show',{tid,post,comments});
    } catch (error) {
        return res.status(400).send({error:error});
    }
})








module.exports=router;
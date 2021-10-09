const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const { isLoggedIn } = require('../config/auth');

router.get('/create',isLoggedIn, (req, res) => {
    res.render('post/new');
})

router.post('/create',isLoggedIn, async (req, res) => {
    try {
        const id = req.user.id;
        const username = req.user.username;
        const newPost = new Post({
            title: req.body.title,
            description: req.body.description,
            created: Date.now(),
            author: { id: id, username: username },
        });
        const postStatus = await newPost.save();
        res.redirect('/profile');
    } catch (error) {
        return res
            .status(404)
            .send({ error: error });
    }
});

router.get('/:id/edit',isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res
            .status(404)
            .send({ error: 'Could not find a post with that post id.' });
    }
    res.render('post/edit', { post: post });
});

router.post('/:id/edit',isLoggedIn, async (req, res) => {
    try {
        const UpdateStatus = await Post.findOneAndUpdate({_id:req.params.id}, {
            title: req.body.title,
            description: req.body.description,
            created: Date.now()
        });
        res.redirect('/profile');
    } catch (error) {
        return res.status(400).send({
            error: 'Couldn\'t update the post. Try again later.',
        });
    }
});

router.post('/:id/delete',isLoggedIn, async(req,res) => {
    try {
        
        const deleteStatus = await Post.deleteOne({_id:req.params.id});
        res.redirect('/profile');

    } catch (error) {
        return res.status(400).send({
            error:'Couldn\'t delete the post. Try again later.'
        });
    }
})

router.get('/profile',isLoggedIn, async(req,res) => {
    const posts=await Post.find({author:{id:req.user._id,username:req.user.username}});
    res.render('profile',{user:req.user,posts:posts});
})

module.exports = router;
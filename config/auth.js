const Comment = require('../models/comment');
const Post = require('../models/post');
module.exports = {

    isLoggedIn : (req,res,next) => {

        if(req.isAuthenticated())
        {
            return next();
        }
        else
        {
            res.redirect('/login');
        }
    },

    checkCommentOwnerShip : async(req,res,next) => {

        const comment=await Comment.findById({_id:req.params.id});
        if(comment.author.id == req.user.id)
        {
            return next();
        }
        else
        {
            res.redirect('back');
        }
        
    },

    checkPostOwnerShip : async(req,res,next) => {

        const post=await Post.findById({_id:req.params.id});
        if(post.author.id == req.user.id)
        {
            return next();
        }
        else
        {
            res.redirect('back');
        }
        
    }
}
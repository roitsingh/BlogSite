const Comment = require('../models/comment');
const post = require('../models/post');
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

    checkOwnerShip : async(req,res,next) => {

        const comment=await Comment.findById({_id:req.params.id});
        if(comment.author.id == req.user.id)
        {
            return next();
        }
        else
        {
            res.redirect('back');
        }
        
    }
}
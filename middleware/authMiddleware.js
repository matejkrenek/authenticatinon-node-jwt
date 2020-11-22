const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {
    const token = req.cookies.token;

    // Verify validation of a token
    if(token){
        jwt.verify(token, 'testing secret string', (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.redirect('/login')
            } else{
                console.log(decodedToken)
                next()
            }   
        })
    } else{
        res.redirect('/login')
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.token;

    if(token){
        jwt.verify(token, 'testing secret string', async (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.locals.user = null;
                next();
            } else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id)
                res.locals.user = user;
                next();
            }
        });
    } else{
        res.locals.user = null;
        next()
    }
}

// export module
module.exports = { requireAuth, checkUser }
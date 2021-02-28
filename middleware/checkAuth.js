const jwt = require('jsonwebtoken');

function checkAuth(req,res,next){
    const userToken = req.cookies['auth-token'];
    if(!userToken) return res.status(401).send('Access denied! Please login first');
    try{
        const verified = jwt.verify(userToken,process.env.SECRET_TOKEN);
        res.locals.user = verified._id;
        next();
    }catch(err){
        res.status(400).send("Invalid Token");
    }
}
module.exports = checkAuth
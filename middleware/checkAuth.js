const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const userToken = req.cookies['auth-token'] || req.header('auth-token');
    if(!userToken) return res.status(401).send('Access denied! Please login first');
    try{
        const verified = jwt.verify(userToken,process.env.SECRET_TOKEN);
        req.user = verified;
        next();
    }catch(err){
        res.status(400).send("Invalid Token");
    }
}
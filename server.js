// Load Library
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Middleware
const logger = require('./middleware/logger');
const checkAuth = require('./middleware/checkAuth');

//Router
const accountRouter = require('./router/auth-router');
const relationRouter = require('./router/relationship-router');
const postRouter = require('./router/post-router');
const userRouter = require("./router/user-router")

const port = process.env.PORT || 5000;
require('dotenv').config();
mongoose.connect(process.env.DB_CONNECTION, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,  
    useCreateIndex: true,
    useFindAndModify: false
}, (err) => {
    if(err) console.log(err)
    else{
        console.log("DB connected!")
    }
})


app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_ORIGIN
}));
app.use(logger);
app.use(cookieParser());
app.use(express.json());
app.use('/checkAuth',checkAuth,(req,res) => {
    res.sendStatus(200);
})
app.use('/api/auth', accountRouter);
app.use('/api/relationship', checkAuth, relationRouter);
app.use('/api/post', checkAuth, postRouter);
app.use('/api/user', userRouter);
app.listen(port, () => {
    console.log(`Server running on http://localhost/${port}`);
})
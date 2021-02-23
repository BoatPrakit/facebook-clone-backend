const express = require('express');
const app = express();
const mongoose = require('mongoose');
const accountRouter = require('./router/auth-router');
const checkAuth = require('./middleware/checkAuth');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/logger');
const cors = require('cors');

require('dotenv').config();
mongoose.connect(process.env.DB_CONNECTION, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,  
    useCreateIndex: true,
}, (err) => {
    if(err) console.log(err)
    else{
        console.log("DB connected!")
    }
})
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(logger);
app.use(cookieParser());
app.use(express.json());
app.use('/api/user', accountRouter);
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
})
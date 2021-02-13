const express = require('express');
const app = express();
const mongoose = require('mongoose');
const accountRouter = require('./router/auth-router');
require('dotenv').config();
mongoose.connect(process.env.DB_CONNECTION, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,  
    useCreateIndex: true,
}, () => {
    console.log("DB connected!")
})
app.use(express.json());
app.use('/api/user', accountRouter);
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
})
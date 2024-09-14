const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes=require("./routes/authRoute");
const adminRoute=require("./routes/adminRoute");
// const taskRoutes=require("./routes/taskRoutes");
const cors=require("cors");
const morgan=require("morgan");
require("dotenv").config();
const { sequelizeCon } = require('./config/databaseConfig');

// const deleteAllUsers=require("./config/seeder")
// const crypto = require('crypto');

// Generate a 32-byte key and a 16-byte IV
// const ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
// const ENCRYPTION_IV = crypto.randomBytes(16).toString('hex');

// console.log('ENCRYPTION_KEY:', ENCRYPTION_KEY);
// console.log('ENCRYPTION_IV:', ENCRYPTION_IV);



app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: 'https://to-do-application-task-api.vercel.app/api/v1/',
    methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  };

// app.use(cors(corsOptions));
app.use(cors())

app.use("/api/v1/auth",authRoutes);
// app.use("/api/v1/task",taskRoutes);
app.use("/api/v1/admin",adminRoute);


app.get("/",(req,res)=>{
    res.send("Welcome to Backend API");
});


app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    res.status(err.statusCode).json({
        status: "failure",
        code: err.statusCode,
        message: err.message,
        data: []
    });
});

app.use((data, req, res, next) => {
    data.message = data.message || 'Fetch Successfully';
    data.data = data.data||[] ;

    res.status(data.statusCode).json({
        code: data.statusCode,
        message: data.message,
        data:data.data
    });
});

// sequelizeCon.sync({alter:true})
app.listen(PORT, () => {
    // seederDB();
        console.log(`Server running on port ${PORT}`);
    });


module.exports = app;
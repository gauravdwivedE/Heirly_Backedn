const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const connectDB = require('./configs/mongoDB')
const chalk = require('chalk');
const userRouter = require('./routes/user.route')
const companiesRouter = require('./routes//company.route')
const jobRouter = require('./routes/job.route')
const applicationRouter = require('./routes/application.route')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const { companyModel } = require('./models/company.model')
const { jobModel } = require('./models/job.model')
const { applicationModel } = require('./models/application.model')
const { userModel } = require('./models/user.model')

console.log(process.env.UI_ORIGIN)
app.use(cors({
  origin: 'https://heirlycom.vercel.app', // Adjust to your frontend domain
  credentials: true, // Allow cookies to be sent with the request
}));

// const corsOptions = {
//   origin: , // Your frontend URL should be here, like 'https://yourfrontend.com'
//   credentials: true, // Allow cookies to be included in cross-origin requests
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers for the request
// };

app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
}))

app.use(express.json({limit : '15mb'}))
app.use(express.urlencoded({limit : '10mb', extended:true}))
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/companies", companiesRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/applications", applicationRouter)

app.get('/set-cookie', (req, res) => {
  // Set the cookie with secure and sameSite settings
  try{
    res.status(200).cookie('user', 'JohnDoe', {
    maxAge: 900000,  // Cookie expiration time (15 minutes)
    httpOnly: true,  // Prevents JavaScript access to the cookie
    secure: true,    // Always send the cookie over HTTPS (in production)
    sameSite: 'None', // Required for cross-site cookies (when using CORS)
  }).send('Cookie has been set');
  }
  catch(err){
    res.status(500).send(err)
  }
});

const port  = process.env.PORT || 8000

app.listen(port,()=>{   
    connectDB()
    console.log(chalk.green(`Server: Server is running on port ${port}`))
})

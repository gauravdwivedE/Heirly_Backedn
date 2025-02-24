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
const corsOptions = {
  origin: process.env.UI_ORIGIN, // Your frontend URL should be here, like 'https://yourfrontend.com'
  credentials: true, // Allow cookies to be included in cross-origin requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers for the request
};

app.use(fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
)
app.use(cors(corsOptions))
app.use(express.json({limit : '10mb'}))
app.use(express.urlencoded({limit : '10mb', extended:true}))
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/companies", companiesRouter)
app.use("/api/jobs", jobRouter)
app.use("/api/applications", applicationRouter)

app.get("/",async (req, res) =>{
   try {
    await companyModel.deleteMany({})
    await jobModel.deleteMany({})
    await applicationModel.deleteMany({})
    await userModel.deleteMany({})
    res.send("deleted")
   } catch (error) {
    res.send(error)
   }
})
const port  = process.env.PORT || 8000

app.listen(port,()=>{   
    connectDB()
    console.log(chalk.green(`Server: Server is running on port ${port}`))
})

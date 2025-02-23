const chalk = require("chalk")
const jwt = require("jsonwebtoken")

const authentication = async (req,res,next) =>{
  try{
    const token = req.cookies.token
    
    if(!token) return res.status(401).send("autherization token missing")
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded) return res.status(401).send("autherization token invalid")
  
    console.log("Request user : ", decoded) 
    req.user = decoded
    next()
  }
  catch(err){
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}

module.exports = authentication
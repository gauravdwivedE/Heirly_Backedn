const chalk = require('chalk')
const {validateJob, jobModel} = require('../models/job.model')

module.exports.createJob = async (req, res) =>{
  try {
    const userId = req.user.id
    const {title, description, requirements, salary, experience, location, jobType, position, company } = req.body
    const error = validateJob({title, description, requirements, salary, experience, location, jobType, position, company, createdBy: userId})
    
    if(error) return res.status(400).send(error)
    const job = await jobModel.create({title, description, requirements, salary, experience, location, jobType, position, company, createdBy: userId})
  
    res.status(201).send(job)
  } 
  catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}

module.exports.getLoggedInUserjobs = async (req, res) =>{
 try {
  const userId = req.user.id
  if(!userId) return res.status(401).send("Unauthenticated : user missing")
  const job = await jobModel.find({createdBy: userId}).populate({ path: 'company' })  

  console.log(job);
  
  if(!job.length) return res.status(404).send("No job found")
  res.status(200).send(job)
 }
 catch (err) {
  console.log(chalk.red(err))
  res.status(500).send(err)
 }
}

module.exports.getAllJob = async (req, res) =>{
  try {
    const keyword = req.query.keyword || ""
    const query = {
      $or:[
        {title: {$regex: keyword, $options:"i"}},
        {description: {$regex: keyword, $options:"i"}}
      ]
    }
    const jobs = await jobModel.find(query).populate({ path: "company" }).populate({
      path : 'applications'
    }).sort({ createdAt:-1 })
    if(!jobs.length) return res.status(404).send("No job found")
    
    res.status(200).send(jobs)
  }
   catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}

module.exports.getJobByID = async (req, res)=>{
  try {
    const {id} = req.params
    const job = await jobModel.findById(id)
    if(!job) return res.status(404).send("No job found")
    res.status(200).send(job)
  } 
  catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}
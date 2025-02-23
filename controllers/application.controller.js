const {applicationModel, validateApplication} = require('../models/application.model')
const {jobModel} = require('../models/job.model')
const chalk = require('chalk')

module.exports.applyJob = async (req, res) =>{
  try {
    const jobId = req.params.id
    const userId = req.user.id
    const status = 'Pending'

    const error = validateApplication({job: jobId, applicant: userId})
    if(error) return res.status(400).send(error)

    const job = await jobModel.findById(jobId)
    if(!job) return res.status(404).send("Job not found in which you are going to apply")

    let application = await applicationModel.findOne({job: jobId, applicant: userId})
    if(application) return res.status(409).send("Already applied for this job")
    
    application = await applicationModel.create({job: jobId, applicant: userId, status})
        
    job.applications.push(application._id)

    await job.save()

    res.status(201).send(application)
  }
   catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}

module.exports.getAllAppliedJob = async (req, res) =>{
  try {
    const userId = req.user.id
    const application = await applicationModel.find({applicant: userId})
    .populate({
      path: 'job',
      options:{sort: {createdAt: -1}, populate: 'applications', sort: {createdAt: -1}},
      populate:{path: 'company', 
      options:{sort: {createdAt: -1}},
    }
    }).sort({createdAt: -1})

    if(!application) return res.status(404).send("No job application found")
    
    res.status(200).send(application)
  }
   catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}

module.exports.getAllApplicants = async (req, res) =>{
  try {
    const jobId = req.params.id
    const userId = req.user.id

    if(!jobId) return res.status(400).send("Job ID is missing")
      
    const applicants = await jobModel.findOne({_id : jobId, createdBy: userId})
    .populate({
      path: 'applications',
      options: { sort: {createdAt: -1} },
      populate: {
        path : 'applicant',
        options: { sort: {createdAt: -1} } 
     }
   }).sort({createdAt :-1})

    if(!applicants) return res.status(404).send("No job applicats found")
    
    res.status(200).send(applicants)
  }
   catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}

module.exports.updateJobStatus = async (req, res) =>{
 try {
   const {status} = req.body
   const applicationId = req.params.id
      
   if(status != "Pending" && status != "Rejected" && status != "Accepted" ) {
   return res.status(400).send("Application status must be  Rejected, Accepted or Pending")}

   const application = await applicationModel.findByIdAndUpdate(applicationId, {status}, {new: true, runValidators: true})
   if(!application) return res.status(401).send("No application found")
  
   res.status(200).send(application)
  }
   catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}
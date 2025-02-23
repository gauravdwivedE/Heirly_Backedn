const Joi = require('joi')
const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  requirements: {type: String},
  salary: {type: Number, required: true},
  location: {type: String, required: true},
  jobType: {type: String, required: true},
  position: {type: Number, required: true},
  experience: {type: Number, required: true},
  company: {type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  applications:[
    {type: mongoose.Schema.Types.ObjectId, ref: "Application"}
  ]
},{timestamps: true})

const validateJob = (data) =>{
  const schema = Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Title is required.",
    }),
  
    description: Joi.string().required().messages({
      "string.empty": "Description is required.",
    }),
  
    requirements: Joi.string().allow("").messages({
      "string.base": "Requirements must be a string.",
    }),
  
    salary: Joi.number().required().messages({
      "number.base": "Salary must be a number.",
      "number.empty": "Salary is required.",
    }),
      
    experience: Joi.number().required().messages({
      "number.base": "Experience must be a number.",
      "number.empty": "Experience is required.",
    }),
  
  
    location: Joi.string().required().messages({
      "string.empty": "Location is required.",
    }),
  
    jobType: Joi.string().required().messages({
      "string.empty": "Job type is required.",
    }),
  
    position: Joi.number().integer().required().messages({
      "number.base": "Position must be a number.",
      "number.empty": "Position is required.",
    }),
  
    company: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      "string.pattern.base": "Company must be a valid ObjectId.",
      "string.empty": "Company reference is required.",
    }),
  
    createdBy: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      "string.pattern.base": "CreatedBy must be a valid ObjectId.",
      "string.empty": "CreatedBy reference is required.",
    }),
  
    applications: Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
      .optional()
      .messages({
        "array.base": "Applications must be an array of valid ObjectIds.",
        "string.pattern.base": "Each application reference must be a valid ObjectId.",
      }),
  })
  const {error} = schema.validate(data)
  return error?.message
}

const jobModel = mongoose.model("Job", jobSchema)

module.exports = {validateJob, jobModel}
const Joi = require('joi')
const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  job: {type: mongoose.Schema.Types.ObjectId, ref:"Job"},
  applicant: {type: mongoose.Schema.Types.ObjectId, ref:"User"},
  status: {type: String, enum:["Pending", "Accepted", "Rejected"], default:"Pending"}

},{timestamps: true})


const validateApplication = (data) =>{
  const schema = Joi.object({
    job: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // Assuming ObjectId is represented as a 24-character hex string
    applicant: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    status: Joi.string().valid("Pending", "Accepted", "Rejected")
  })
  const {error} = schema.validate(data)
  return error?.message
}

const applicationModel = mongoose.model("Application", applicationSchema)

module.exports = {validateApplication, applicationModel}
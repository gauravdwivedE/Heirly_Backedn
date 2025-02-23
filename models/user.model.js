const Joi = require('joi')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullname:{type:String, required:true},

  email: {type:String, required:true, unique:true},

  phoneNumber: {type:Number,required:true},

  password: {type:String,required:true},

  role: {type:String,enum:["Job seeker","Recruiter"],required:true},

  profile:{
   bio: {type: String},
   skills: [{type: String}],
   resume: {type: String},
   resumeOriginalName: {type: String},
   profilePhoto: {type: String},
   company:{type: mongoose.Schema.Types.ObjectId, ref:"Company"}
  }

},{timestamps:true})

const validateUser = (data) =>{
  const schema = Joi.object({

  fullname: Joi.string().required().messages({
    "string.empty": "Full name is required.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email address.",
    "string.empty": "Email is required.",
  }),

  phoneNumber: Joi.string()
  .pattern(/^[0-9]{10}$/) // Ensure it's a 10-digit number
  .required()
  .messages({
    'string.pattern.base': 'Mobile number must be a 10-digit number.',
    'string.empty': 'Phone number is required.',
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),

  role: Joi.string().valid("Job seeker", "Recruiter").required().messages({
    "any.only": "Role must be either 'Job seeker' or 'Recruiter'.",
    "string.empty": "Role is required.",
  }),

  profile: Joi.object({
    bio: Joi.string().allow(""),
    skills: Joi.array().items(Joi.string()).allow(null),
    resume: Joi.string().uri().allow(""),
    resumeOriginalName: Joi.string().allow(""),
    profilePhoto: Joi.string().uri().allow(""),
  }).optional(),

  // Timestamps can be validated as ISO date strings (if required)
  createdAt: Joi.date().iso().optional(),
  updatedAt: Joi.date().iso().optional()
  })

  const {error} = schema.validate(data)
  return error?.message
  
}
const userModel = mongoose.model("User",userSchema)

module.exports = {validateUser, userModel}
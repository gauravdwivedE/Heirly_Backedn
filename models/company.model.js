const Joi = require('joi');
const mongoose = require('mongoose')

const companySchema = new mongoose.Schema({
  name: {type: String, required:true, unique:true},
  description: {type: String},
  location: {type: String},
  website: {type: String},
  logo: {type: String},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required:true}, 
},{timestamps: true})

const validateCompany = (data) =>{
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Name is required.",
    }),
  
    description: Joi.string().allow("").messages({
      "string.base": "Description must be a string.",
    }),
  
    location: Joi.string().allow("").messages({
      "string.base": "Location must be a string.",
    }),
  
    website: Joi.string().uri().allow("").messages({
      "string.uri": "Website must be a valid URL.",
    }),
  
    logo: Joi.string().uri().allow("").messages({
      "string.uri": "Logo must be a valid URL.",
    }),
  
    userId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
      "string.pattern.base": "UserId must be a valid ObjectId.",
      "string.empty": "UserId is required.",
    }),
  });

  const {error} = schema.validate(data)
  return error?.message
  
}

const companyModel = mongoose.model("Company", companySchema)

module.exports = {validateCompany, companyModel}
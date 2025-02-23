const { validateCompany, companyModel } = require("../models/company.model");
const chalk = require('chalk');
const cloudinary = require("../utils/cloudinary");

module.exports.registerCompany = async (req, res) =>{
  try {
    
    const userId = req.user.id
    const {name, description, location, website} = req.body
    const error = validateCompany({name, description, location, website, userId})
    if(error) return res.status(400).send(error)
    
    let company = await companyModel.findOne({name})
    if(company) return res.status(409).send("Company already registered")

    company = await companyModel.create({name, description, location, website, userId})

    res.status(201).send(company)
  }
   catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}

module.exports.getCompanies = async (req, res) =>{
  try {
    const userId = req.user.id
    if(!userId) return res.status(401).send("Unauthorized : user missing")
    
    const company = await companyModel.find({userId})
    if(!company.length) return res.status(404).send("Companies not found")

    res.status(200).send(company)
  } 
  catch (err) {
    console.log(chalk.red(err))
    res.status(500).send(err)
  }
}

module.exports.getCompaniesById = async (req, res) =>{
  try {
    const {id} = req.params
    const userId = req.user.id

    if(!id || !userId) return res.status(401).send("Unauthorized : user missing")

    const company = await companyModel.findOne({_id: id, userId})
    if(!company) return res.status(404).send("Company not found")

    res.status(200).send(company)
  } 
  catch (err) {
     console.log(chalk.red(err))
     res.status(500).send(err)
  }
}

module.exports.updateCompany = async (req, res) =>{
  try {
    const {id} = req.params
    const userId = req.user.id
    const {name, description, location, website} = req.body

    const error = validateCompany({name, description, location, website, userId})  
    
    if(error) return res.status(400).send(error)

    const company = await companyModel.findOne({_id: id, userId})
    if(!company) return res.status(404).send("Company not found")

    let uploadResult = null
    if(req.files?.logo){
      uploadResult = await cloudinary.uploader.upload(req.files.logo.tempFilePath, { 
      filename_override: req.files.logo.name,
      folder: "companyLogo", 
    })
  }
    company.name = name,
    company.description = description,
    company.location = location,
    company.website = website,
    company.logo = uploadResult?.secure_url
    
    await company.save()
    res.status(200).send(company)
  } 
  catch (err) {
     console.log(chalk.red(err))
     res.status(500).send(err)
  }
}
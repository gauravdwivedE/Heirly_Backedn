const { validateUser, userModel } = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const chalk = require('chalk')
const cloudinary = require('../utils/cloudinary')

module.exports.signup = async (req, res) =>{
  try{
    const {fullname, email, phoneNumber, password, role, profileImage } = req.body
    const error = validateUser({fullname, email, phoneNumber, password, role })
    if(error) return res.status(400).send(error)
  
    let user = await userModel.findOne({email})
    if(user) return res.status(409).send("Entity already exist") 
          
    const salt = await bcrypt.genSalt()
    const hashedPass = await bcrypt.hash(password, salt)

    let uploadResponse = null 
    if(profileImage && JSON.stringify(profileImage) !== '{}'){
     uploadResponse = await cloudinary.uploader.upload(profileImage, { folder: "Hierly uploads" }) 
    }
 
    user = await userModel.create({ fullname, email, phoneNumber, password: hashedPass, role, profile: { profilePhoto: uploadResponse?.secure_url } })

    const payload = {id: user._id, role: user.role} ;
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    user = {
      id: user._id,
      fullname: user.fullname,
      role: user.role,
      phoneNumber: user.phoneNumber,
      email:user.email,
      profile: user.profile
    };

   
  res.status(201).cookie('token', token, {
     maxAge: 1 * 24 * 60 * 60 * 1000,  // Cookie expiration time (15 minutes)
     httpOnly: true,  // Prevents JavaScript access to the cookie
     secure: true,    // Always send the cookie over HTTPS (in production)
     sameSite: 'None', // Required for cross-site cookies (when using CORS)
  }).send(user);
    
  }catch(err){
    console.log(chalk.red(err));
    res.status(500).send(err)
  }
}

module.exports.login = async (req, res) =>{
  try{
    const {email, password, role} = req.body
    const error = validateUser({fullname: 'gaurav', email, phoneNumber: '4343533335', password, role })
    if(error) return res.status(400).send(error)
  
    let user = await userModel.findOne({email})
    if(!user) return res.status(401).send("Invalid email or password") 
    
    const passwordMatched = await bcrypt.compare(password,user.password)
    if(!passwordMatched) return res.status(401).send("Invalid email or password")
      
    if(user.role != role) return res.status(401).send("Account does't exist with current role")  

    const payload = {id: user._id, role: user.role}  ;
    const token = jwt.sign(payload,process.env.JWT_SECRET);
    
    user = {
      id: user._id,
      fullname: user.fullname,
      role: user.role,
      phoneNumber: user.phoneNumber,
      email:user.email,
      profile: user.profile
    };
    
  res.status(200).cookie('token', token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,  
    httpOnly: true,  // Prevents JavaScript access to the cookie
    secure: true,    // Always send the cookie over HTTPS (in production)
    sameSite: 'None', // Required for cross-site cookies (when using CORS)
  }).send(user);
    
  }catch(err){
    console.log(chalk.red(err));
    res.status(500).send(err)  
  }
}

module.exports.logout = async (req, res) =>{
  try{
      res.status(200).cookie("token", "" , {maxAge: 0}).send({message: "Logged out successfully"})
  }
  catch(err){
    res.send(500).send(err)
    console.log(chalk.red(err));
  }
}

module.exports.updateProfile = async (req, res) =>{
  try{
     const {fullname, email, phoneNumber, bio, skills} = req.body
     
      const error = validateUser({fullname, email, role:"Job seeker", phoneNumber, password:' 2343544'})
      if(error) return res.status(400).send(error)
      
     const user = req.user
     if(!user) return res.status(401).send("Unauthorized : user missing")

      let uploadResult = null
      if(req.files?.resume){
        uploadResult = await cloudinary.uploader.upload(req.files.resume.tempFilePath, { 
        filename_override: req.files.resume.name,
        folder: "file-pdf", 
      })
    }
     let skillsArray = []
      if(skills){skillsArray = skills.split(",")}
    
      const updatedUser = await userModel.findByIdAndUpdate(user.id, {fullname, email, role:user.role, phoneNumber, 'profile.skills': skillsArray, 'profile.bio': bio, 'profile.resume': uploadResult?.secure_url,'profile.resumeOriginalName': req.files?.resume?.name,  },{new: true, runValidators: true})
      if(!user) return res.status(401).send("Unauthorized : Invalid user id")

      res.status(200).send(updatedUser)

  }
  catch(err){
    console.log(chalk.red(err));
    res.status(500).send(err)
  }
}

module.exports.updateProfileImage = async (req, res) =>{
  try{
    const {id} = req.user
    const user = await userModel.findById(id)

    if(!user){return res.status(404).send("User not found")}
    
    const {image} = req.body

    if(user.profile.profilePhoto){
      
     const oldImagePublicId = extractPublicId(user.profile.profilePhoto)
     
     const result =  await cloudinary.api.delete_resources([oldImagePublicId], {  
        type: 'upload',          // Specify the resource type
        resource_type: 'image'   // Specify that it's an image
      })

      if(!result) { return res.status(500).send("Error updating profile image")}
    }
    const uploadResponse = await cloudinary.uploader.upload(image, { folder: "Hierly uploads" }) 

    user.profile.profilePhoto = uploadResponse.secure_url

    await user.save()
    res.status(200).send({newImageURL: uploadResponse.secure_url})
  }
  catch(err){
    console.log(err);
  }
}

function extractPublicId(secureUrl) {
  const regex = /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/v\d+\/(.+?)\.[a-z]{3,4}$/;
  const match = secureUrl.match(regex);
  if (match) {
    // Decode the public_id to handle any encoded characters (like '%20' for spaces)
    return decodeURIComponent(match[1]);
  }
  return null; // Return null if public_id extraction fails
}


const express = require('express')
const router = express.Router()
const authentication = require('../middleware/authentication')
const upload = require('../middleware/multer')

const {signup, login, logout, updateProfile, updateProfileImage} = require('../controllers/user.controller') 

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.put("/profile", authentication, updateProfile)
router.patch("/profile/image", authentication, updateProfileImage)

module.exports = router
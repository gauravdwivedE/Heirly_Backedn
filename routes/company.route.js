const express = require('express')
const { registerCompany, getCompanies, getCompaniesById, updateCompany} = require('../controllers/company.controller')
const authentication = require('../middleware/authentication')
const router = express.Router()


// router.get("/", getCompany)
// router.get("/:id", getCompanyById)
// router.put("/:id", updateCompany)

router.route("/").post(authentication, registerCompany).get(authentication, getCompanies),
router.route("/:id").get(authentication, getCompaniesById).put(authentication, updateCompany)

module.exports = router
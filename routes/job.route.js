const express = require('express')
const router = express.Router()
const {createJob, getAllJob, getJobByID, getLoggedInUserjobs} = require('../controllers/job.controller')
const authentication = require('../middleware/authentication')

router.route("/").post(authentication, createJob).get(getAllJob)
router.route("/admin").get(authentication, getLoggedInUserjobs)
router.route("/:id").get(getJobByID)


module.exports = router
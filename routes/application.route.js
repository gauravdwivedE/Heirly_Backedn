const express = require('express')
const router = express.Router()
const {getAllAppliedJob, applyJob, getAllApplicants, updateJobStatus} = require('../controllers/application.controller')
const authentication = require('../middleware/authentication')

router.route('/').get(authentication, getAllAppliedJob)
router.route('/status/:id/').put(authentication, updateJobStatus)
router.route('/:id').post(authentication, applyJob).get(authentication, getAllApplicants)

module.exports = router
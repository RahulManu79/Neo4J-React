const express = require('express')
const { getCourses, viewCourse } = require('../controller/course.controller')
const router = express.Router()

router.get('/courses',getCourses)
router.get('/:id',viewCourse)

module.exports = router
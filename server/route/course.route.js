const express = require('express')
const { getCourses, viewCourse, enrollCourse, enrolledCourses } = require('../controller/course.controller')
const router = express.Router()

router.get('/courses',getCourses)
router.get('/:id',viewCourse)
router.post('/enroll',enrollCourse)
router.get('/enrolledCourse/:username', enrolledCourses)

module.exports = router
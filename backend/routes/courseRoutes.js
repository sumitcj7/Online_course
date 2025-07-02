import { createCourse,enrolledInCourses,getMycourse,getAllCourse } from "../controllers/courseController.js";
import { requiredRole,protect } from "../middlewares/authMiddleware.js";
import express from "express"

const router=express.Router();

router.get('/',getAllCourse);
router.post('/',protect,requiredRole('instructor'),createCourse);
router.post('/:id/enroll',protect,requiredRole('student'),enrolledInCourses);
router.get('/my-courses',protect,requiredRole('student'),getMycourse)

export default router
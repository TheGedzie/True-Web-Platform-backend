import { Router } from "express";
import { getCourses, getCourse } from "../../controllers/courseController/index.js"; 

const router = Router()
router.get('/', getCourses)
router.get('/:id', getCourse)

export default router
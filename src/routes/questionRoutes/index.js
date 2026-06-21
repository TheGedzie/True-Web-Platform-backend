import { Router } from "express";
import { getQuestions, getQuestion, postQuestion, patchQuestion } from "../../controllers/questionsController/index.js";

const router = Router()
router.get('/', getQuestions)
router.get('/:id', getQuestion)
router.post('/create', postQuestion)
router.patch('/:id', patchQuestion)

export default router
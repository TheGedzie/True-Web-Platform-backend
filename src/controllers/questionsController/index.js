import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { writeFileSync } from 'node:fs'

const data = fs.readFileSync('./src/database.json', 'utf-8')
const database = JSON.parse(data)
const questions = database.questions

export const getQuestions = async(req, res) => {
    if(!questions){
      return  res.status(400).json({"error" : "Не удалость получить список вопросов"})
    }
    res.status(200).json(questions)
}
export const getQuestion = async (req, res) => {
    if (!questions) {
        return res.status(400).json({ "error": "Не удалось получить список вопросов" })
    }
    
    const { id } = req.params
    const questionIndex = database.questions.findIndex(q => q.id === id)
    
    if (questionIndex === -1) {
        return res.status(404).json({ "error": "Вопрос не найден" })
    }
    
    database.questions[questionIndex].views = (database.questions[questionIndex].views || 0) + 1
    
    // Сохраняем в файл
    writeFileSync('./src/database.json', JSON.stringify(database, null, 2), 'utf-8')
    
    res.status(200).json(database.questions[questionIndex])
}
export const postQuestion = async (req, res) => {
    try {
        if (!questions) {
             return  res.status(400).json({"error" : "Не удалость получить список вопросов"})
        }
        
        const newId = randomUUID()
        // Создаем новый вопрос
        const newQuestion = {
            id: newId,
            title: req.body.title,
            content: req.body.content,
            authorId: req.body.authorId,
            authorName: req.body.authorName,
            authorAvatar: req.body.authorAvatar || "/avatars/default.png",
            createdAt: new Date().toISOString(),
            views: 0,
            answers: []
        }
        
        // Добавляем в массив
        questions.push(newQuestion)
        
        // Сохраняем в файл
        writeFileSync('./src/database.json', JSON.stringify(database, null, 2), 'utf-8')
        
        // Возвращаем созданный вопрос
        return res.status(201).json(newQuestion)
        
    } catch (error) {
        console.error('Ошибка при создании вопроса:', error)
        return res.status(500).json({ error: "Ошибка сервера" })
    }
}
export const patchQuestion = (req, res) => {
    const { id } = req.params
    const { changeIsBeast, answer } = req.body
            console.log('Ищем вопрос с id:', id)
        console.log('Все вопросы:', database.questions.map(q => q.id))
    
    // Сначала находим вопрос
    const questionIndex = database.questions.findIndex(q => q.id === id)
    
    if (questionIndex === -1) {
        return res.status(404).json({ error: "Вопрос не найден" })
    }
    

    if (changeIsBeast) {
        if (!changeIsBeast.idAnswer) {
            return res.status(400).json({ error: "Не пришло id ответа на вопрос" })
        }
        const currentAnswer = database.questions[questionIndex].answers.find(
            el => el.id === changeIsBeast.idAnswer
        )
        
        if (!currentAnswer) {
            return res.status(404).json({ message: "Ответ на вопрос не найден" })
        }
        
        database.questions[questionIndex].answers.forEach(a => {
            a.isBest = false
        })
        
        currentAnswer.isBest = true
        writeFileSync('./src/database.json', JSON.stringify(database, null, 2), 'utf-8')
        
        return res.status(200).json({ message: "Лучший ответ обновлен" })
    }
    if (!answer || !answer.content) {
        return res.status(400).json({ error: "Нет текста ответа" })
    }
    
    const authorId = answer.authorId
    const checkAnswer = database.questions[questionIndex].answers.find(
        a => a.authorId === authorId
    )
    
    if (database.questions[questionIndex].authorId === authorId) {
        return res.status(403).json({ error: "Вы являетесь автором вопроса" })
    }
    
    if (checkAnswer) {
        return res.status(409).json({ message: "Автор уже отвечал на этот вопрос" })
    }
    
    const newAnswer = {
        id: randomUUID(),
        content: answer.content,
        authorId: answer.authorId,
        authorName: answer.authorName,
        authorAvatar: answer.authorAvatar || "/avatars/default.png",
        createdAt: new Date().toISOString(),
        isBest: false
    }
    database.questions[questionIndex].answers.push(newAnswer)
    writeFileSync('./src/database.json', JSON.stringify(database, null, 2), 'utf-8')
    
    return res.status(201).json(newAnswer)
}
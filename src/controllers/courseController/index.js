import fs from 'node:fs'

const data = fs.readFileSync('./src/database.json', 'utf-8')
const database = JSON.parse(data)
const courses = database.courses

export const getCourses = (req, res) => {
    if(!courses){
        return res.status(400).json({error: "Не удалось получить список курсов !"})
    }
   return res.status(200).json(courses)
}

export const getCourse = (req, res) => {
    const {id} = req.params
    const course = courses.find(c => c.id === id)

    if(!course){
        return res.status(404).json({error: "Курс не найден"})
    }
    return res.status(200).json(course)
}
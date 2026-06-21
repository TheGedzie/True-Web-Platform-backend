import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key_123'

export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({ error: 'Нет доступа' })
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Неверный токен' })
    }
}
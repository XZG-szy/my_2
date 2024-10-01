// backend/middleware/authenticate.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('JWT 验证失败:', error);
            return res.status(401).json({ error: '无效的令牌' });
        }
    } else {
        return res.status(401).json({ error: '没有授权令牌' });
    }
};

export default authenticate;

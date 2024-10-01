// backend/server.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// 中间件
app.use(bodyParser.json());
app.use(cors());

// 路由
app.use('/api/auth', authRoutes);

// 默认路由
app.get('/', (req, res) => {
    res.send('欢迎来到后端 API');
});

// 连接数据库并启动服务器
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`服务器运行在端口 ${PORT}`);
    });
});

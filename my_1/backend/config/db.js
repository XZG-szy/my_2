// backend/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // 禁用日志
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL 数据库连接成功');
        await sequelize.sync(); // 同步所有模型
    } catch (error) {
        console.error('无法连接到数据库:', error);
        process.exit(1);
    }
};

export { sequelize, connectDB };

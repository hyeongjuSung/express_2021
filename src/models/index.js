import dotenv from 'dotenv';
import Sequelize from 'sequelize';

import User from './user.js'
import Board from './board.js'
import Permission from './permission.js'

dotenv.config();

const { DATABASE, DATABASE_HOST, USER_NAME, PASSWORD, LOGGING } = process.env;

const sequelize = new Sequelize(DATABASE, USER_NAME, PASSWORD, {
    host: DATABASE_HOST,
    dialect: 'mysql',
    logging: (LOGGING ==='true')
});

sequelize.authenticate().then(() => {
    console.log("연결 성공");
}).catch(err => {
    console.log("연결 실패: ", err);
});

const db = {
    User: User(sequelize, Sequelize.DataTypes),
    Board: Board(sequelize, Sequelize.DataTypes),
    Permission: Permission(sequelize, Sequelize.DataTypes)
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

Object.keys(db) // -> return ["User", "Board", "Permission"]
    .forEach((modelName) => {
        // modelName -> String "User", "Board", "Permission"
        if(db[modelName].associate) { // associate 존재 여부 판단하여 조건문 실행
            db[modelName].associate(db); // associate 안에 할당한 함수를 실행
        }
});

export default db;
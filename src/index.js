import express from "express";
import sequelize  from "sequelize";
import user_router from './route/users.js';
import board_router from './route/boards.js';

const app = express();
const seq = new sequelize('express', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});
seq.authenticate()
    .then(() => {
        console.log('db 연결 성공')
    })
    .catch(err => {
        console.error('db 연결 실패', err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", user_router);
app.use("/boards", board_router);

app.listen(3000);



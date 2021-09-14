import express from "express";
import sequelize  from "sequelize";
import user_router from './route/users.js';
import board_router from './route/boards.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", user_router);
app.use("/boards", board_router);

app.listen(3000);
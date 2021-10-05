import express from "express";
import user_router from './route/users.js';
import board_router from './route/boards.js';

import db from './models/index.js';

const app = express();

db.sequelize.sync().then(()=>{
    console.log("sync 끝");
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/users", user_router);
    app.use("/boards", board_router);
    app.listen(3000);
}
import express from "express";
import user_router from './route/users.js';
import board_router from './route/boards.js';

import db from './models/index.js';

const app = express();
// if(process.env.NODE_ENV==="development"){
//     // foreign key 체크 해제
//     db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", {raw: true})
//     .then(() => {
//         // 기존 테이블을 모두 지우고 새로 생성
//         //force: true 옵션은 모델 변경 직후에만 넣고 그 이외에는 빼주는게 좋음
//         db.sequelize.sync({force: true}).then(()=>{
//             console.log("sync 끝");
//             app.use(express.json());
//             app.use(express.urlencoded({ extended: true }));
//             app.use("/users", user_router);
//             app.use("/boards", board_router);
//             app.listen(3000);
//         });
//     });
// } else if(process.env.NODE_ENV==="production"){
//     db.sequelize.sync().then(()=>{ // 기존 테이블을 모두 지우고 새로 생성
//         console.log("sync 끝");
//         app.use(express.json());
//         app.use(express.urlencoded({ extended: true }));
//         app.use("/users", user_router);
//         app.use("/boards", board_router);
//         app.listen(3000);
//     }); 
// }
// foreign key 체크 해제
db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", {raw: true})
.then(() => {
    db.sequelize.sync({force: true}).then(()=>{ // 기존 테이블을 모두 지우고 새로 생성
        console.log("sync 끝");
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use("/users", user_router);
        app.use("/boards", board_router);
        app.listen(3000);
    });
});
import express from "express";
import user_router from './route/users.js';
import board_router from './route/boards.js';

import db from './models/index.js';

const app = express();
// NODE_ENV 환경변수 체크
if(process.env.NODE_ENV==="development"){
    // db에서 외래키 체크를 강제로 해제, 반드시 로컬 개발 환경에서만 제한적으로 사용
    db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0", {raw: true})
    .then(() => {
        // 기존 테이블을 모두 지우고 새로 생성
        //force: true 옵션은 모델 변경 직후에만 넣고 그 이외에는 빼주는게 좋음
        db.sequelize.sync({force: true}).then(()=>{ // 기존 테이블 구조를 무시하고 현재 코드의 모델 구조로 강제로 동기화(기존 테이블을 모두 지우고 새로 생성)
            console.log("개발환경 sync 끝");
            app.use(express.json());                         // req.body 파싱을 위한 코드
            app.use(express.urlencoded({ extended: true })); // req.body 파싱을 위한 코드
            app.use("/users", user_router);         // localhost:3000/users
            app.use("/boards", board_router);       // localhost:3000/boards
            app.listen(3000);       // 3000포트로 실행
        });
    });
} else if(process.env.NODE_ENV==="production"){
    db.sequelize.sync().then(()=>{ // 현재 코드의 모델과 데이터베이스를 동기화 하되 기존에 
        console.log("상용환경 sync 끝");
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use("/users", user_router);
        app.use("/boards", board_router);
        app.listen(3000);
    }); 
}
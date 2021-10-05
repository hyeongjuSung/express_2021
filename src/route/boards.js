import {Router} from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";

const seq = new sequelize('express', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    //logging: false
});

const Board = seq.define("board", {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    content: {
        type: sequelize.TEXT,
        allowNull: true
    }
});

const board_sync = async() => {
    try{
        await Board.sync({force:true});
        for(let i=0; i<10000; i++){
            await Board.create({
                title: faker.lorem.sentences(1),
                content: faker.lorem.sentences(10)
            })
        }
    }catch(err){
        console.log(err)
    }
}
//board_sync();

const boardRouter = Router();

let boards = [];

boardRouter.get("/", async(req, res) => {
    try{
        const boards = await Board.findAll();
        res.status(200).send({
            count: boards.length,
            boards
        })
    }catch(err){
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
    
});

boardRouter.get("/:id", async(req, res) => {
    try{
        const findBoard = await Board.findOne({
            where: {
                id: req.params.id
            }
        });

        if(findBoard) {
            res.status(200).send({
                findBoard
            })
        }else {
            res.status(400).send({msg: "해당 게시글은 존재하지 않습니다."});
        }

    }catch(err){
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
});

//글생성
boardRouter.post("/", async(req, res) => {
    try{
        const { title, content } = req.body;
        if(!title) res.status(400).send({msg: "입력 요청 값이 잘못되었습니다."})
        
        const result = await Board.create({
            title: title ? title : null, 
            content: content ? content : null
        });
        res.status(201).send({
            msg: `id ${result.id}, ${result.title} 게시글이 생성되었습니다.`
        });
    }catch(err){
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
});

//content 변경
boardRouter.put("/:id", (req, res) => {
    const find_board_idx = _.findIndex(boards, {id: parseInt(req.params.id)});
    let result;

    if(find_board_idx !== -1){
        boards[find_board_idx].content = req.body.content;
        result = "성공적으로 수정되었습니다."
        res.status(200).send({
            result
        })
    } else {
        result = `아이디가 ${req.params.id}번인 게시글이 존재하지 않습니다.`;
        res.status(400).send({
            result
        })
    }
});

//게시글 지우기
// boardRouter.delete("/:id", (req, res) => {
//     const check_board = _.find(boards, {id: parseInt(req.params.id)});
//     let result;

//     // 같은 아이디 값을 가진 값이 있으면?
//     if(check_board){
//         // lodash의 reject 메서드를 이용해 해당 id를 가진 객체를 삭제
//         boards = _.reject(boards, ["id", parseInt(req.params.id)]);
//         result = "성공적으로 삭제 되었습니다."; 
//         res.status(200).send({
//             result
//         });
//     } else {
//         result = `${req.params.id} 아이디를 가진 게시글이 존재하지 않습니다.`;
//         res.status(400).send({
//             result
//         })
//     }

// });
boardRouter.delete("/:id", async(req, res) => {
    try{
        let board = await Board.findOne({
            where:{
                id: req.params.id
            }
        })
        if(!Board){
            req.status(400).send({msg: '해당 게시글은 존재하지 않습니다.'});
        }
        await Board.destroy();
        res.status(200).send({msg: '게시글이 삭제되었습니다.'});

    }catch(err){
        console.log(err);
        res.status(500).send({msg: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.'})
    }

});

export default boardRouter